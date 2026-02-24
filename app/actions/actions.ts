 
'use server'

import ContactResponseEmail from '@/components/contact/EmailTemplate'
import { FeedbackState } from '@/types/contact'
import { Resend } from 'resend'
import { after } from 'next/server'
import { headers } from 'next/headers'
import { z } from 'zod'

const ContactFormSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  service: z.string().min(1).max(100),
  phone: z.string().regex(/^\d{10,15}$/, {
    message: 'Phone number must be 10 to 15 digits',
  }),
})

// Simple in-memory rate limiter (server-auth-actions: treat server actions like API routes)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

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
      timeStamp: Date.now(),
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
      timeStamp: Date.now(),
    }
  }

  const { email, firstName, lastName, service, phone } = result.data

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'anh487303@gmail.com',
      subject: `New Contact Request from ${firstName} ${lastName}`,
      react: ContactResponseEmail({
        firstName,
        lastName,
        email,
        service,
        phone,
      }),
    })

    // server-after-nonblocking: log after response is sent
    after(() => {
      console.info(`[Contact] Email sent from ${email} for ${service}`)
    })

    return {
      status: 'success',
      message: 'Email sent successfully',
      timeStamp: Date.now(),
    }
  } catch (error) {
    // server-after-nonblocking: log error after response
    after(() => {
      console.error('[Contact] Failed to send email:', error)
    })

    return {
      status: 'error',
      message: 'Failed to send email. Please try again.',
      timeStamp: Date.now(),
    }
  }
}

