 
'use server'

import ContactResponseEmail from '@/components/contact/EmailTemplate'
import { AutoReplyEmail, getAutoReplySubject } from '@/components/contact/AutoReplyEmail'
import { FeedbackState } from '@/types/contact'
import { Resend } from 'resend'
import { after } from 'next/server'
import { headers } from 'next/headers'
import { z } from 'zod'
import { siteConfig } from '@/lib/site-config'

// Validate required env vars at module load (1.2)
const RESEND_API_KEY = process.env.RESEND_API_KEY
if (!RESEND_API_KEY) {
  console.error('[Contact] RESEND_API_KEY environment variable is not set. Email sending will fail.')
}

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || siteConfig.author.email
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'contact@anhnguyendev.me'

// Module-level singleton (2.10)
const resend = new Resend(RESEND_API_KEY)

const ContactFormSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  service: z.string().min(1).max(100),
  phone: z.string().regex(/^\d{10,15}$/, {
    message: 'Phone number must be 10 to 15 digits',
  }),
  message: z.string().min(1).max(5000),
  locale: z.enum(['en', 'vi']).default('en'),
})

// In-memory limiter with cleanup.
// NOTE: For multi-instance deployments, move this to Redis/KV for shared state.
const rateLimitMap = new Map<string, { count: number; resetTime: number; lastRequestTime: number }>()
const RATE_LIMIT = Number(process.env.CONTACT_RATE_LIMIT ?? '5')
const RATE_WINDOW_MS = Number(process.env.CONTACT_RATE_WINDOW_MS ?? '60000')
const MIN_REQUEST_INTERVAL_MS = Number(process.env.CONTACT_MIN_REQUEST_INTERVAL_MS ?? '10000')

function getClientKey(headersList: Headers, email: string): string {
  const forwardedFor = headersList.get('x-forwarded-for')
  const realIp = headersList.get('x-real-ip')
  const userAgent = headersList.get('user-agent') || 'unknown-agent'
  const ip =
    forwardedFor?.split(',')[0]?.trim() ||
    realIp ||
    'unknown-ip'

  return `${ip}:${email.toLowerCase()}:${userAgent}`
}

function isRateLimited(clientKey: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(clientKey)

  // Prune expired entries periodically to prevent memory leak
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetTime) rateLimitMap.delete(key)
    }
  }

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(clientKey, {
      count: 1,
      resetTime: now + RATE_WINDOW_MS,
      lastRequestTime: now,
    })
    return false
  }

  if (now - entry.lastRequestTime < MIN_REQUEST_INTERVAL_MS) {
    return true
  }

  entry.count++
  entry.lastRequestTime = now
  return entry.count > RATE_LIMIT
}

export async function sendEmail(prevState: FeedbackState, formData: FormData): Promise<FeedbackState> {
  // Honeypot check — bots fill this field, humans never see it
  if (formData.get('website')) {
    // Silently return success so bots don't know they were rejected
    return { status: 'success', message: 'Email sent successfully', timestamp: Date.now() }
  }

  const raw = {
    email: formData.get('email'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    service: formData.get('service'),
    phone: formData.get('phone'),
    message: formData.get('message'),
    locale: formData.get('locale'),
  }

  const result = ContactFormSchema.safeParse(raw)

  // js-early-exit: return early on validation failure
  if (!result.success) {
    return {
      status: 'error',
      message: 'Validation failed: Please check your inputs.',
      timestamp: Date.now(),
    }
  }

  const { email, firstName, lastName, service, phone, message, locale } = result.data

  // server-auth-actions: rate limit public server action after validating payload
  const headersList = await headers()
  const clientKey = getClientKey(headersList, email)
  if (isRateLimited(clientKey)) {
    return {
      status: 'error',
      message: 'Too many requests. Please try again later.',
      timestamp: Date.now(),
    }
  }

  try {
    // Send notification to site owner + auto-reply to user in parallel
    await Promise.all([
      resend.emails.send({
        from: CONTACT_FROM_EMAIL,
        to: CONTACT_TO_EMAIL,
        subject: `New contact from portfolio — ${firstName} ${lastName}`,
        react: ContactResponseEmail({
          firstName,
          lastName,
          email,
          service,
          phone,
          message,
          locale,
        }),
      }),
      resend.emails.send({
        from: CONTACT_FROM_EMAIL,
        to: email,
        subject: getAutoReplySubject(locale),
        react: AutoReplyEmail({ firstName, locale }),
      }),
    ])

    // server-after-nonblocking: log after response is sent
    after(() => {
      console.info(`[Contact] Email sent from ${email} for ${service}`)
    })

    return {
      status: 'success',
      message: 'Email sent successfully',
      timestamp: Date.now(),
    }
  } catch (error) {
    // server-after-nonblocking: log error after response
    after(() => {
      console.error('[Contact] Failed to send email:', error)
    })

    return {
      status: 'error',
      message: 'Failed to send email. Please try again.',
      timestamp: Date.now(),
    }
  }
}

