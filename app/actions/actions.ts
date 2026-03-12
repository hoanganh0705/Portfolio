 
'use server'

import ContactResponseEmail from '@/components/contact/EmailTemplate'
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
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev'

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
})

// Rate limiter with cleanup (1.4 — still in-memory, but with pruning + note)
// NOTE: For production on serverless (Vercel), replace with Upstash Redis rate limiting.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  // Prune expired entries periodically to prevent memory leak
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetTime) rateLimitMap.delete(key)
    }
  }

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT
}

export async function sendEmail(prevState: FeedbackState, formData: FormData): Promise<FeedbackState> {
  // server-auth-actions: rate limit public server action
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (isRateLimited(ip)) {
    return {
      status: 'error',
      message: 'Too many requests. Please try again later.',
      timestamp: Date.now(),
    }
  }

  const raw = {
    email: formData.get('email'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    service: formData.get('service'),
    phone: formData.get('phone'),
    message: formData.get('message'),
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

  const { email, firstName, lastName, service, phone, message } = result.data

  try {
    await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      subject: `New Contact Request from ${firstName} ${lastName}`,
      react: ContactResponseEmail({
        firstName,
        lastName,
        email,
        service,
        phone,
        message,
      }),
    })

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

