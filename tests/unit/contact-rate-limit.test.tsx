import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import type { FeedbackState } from '@/types/contact'

const resendMocks = vi.hoisted(() => ({
  send: vi.fn().mockResolvedValue({ id: 'mock-email-id' }),
}))

const nextHeadersMocks = vi.hoisted(() => ({
  headers: vi.fn(),
}))

vi.mock('resend', () => ({
  Resend: class {
    emails = {
      send: resendMocks.send,
    }
  },
}))

vi.mock('next/headers', () => ({
  headers: nextHeadersMocks.headers,
}))

vi.mock('next/server', () => ({
  after: (callback: () => void) => callback(),
}))

vi.mock('@/components/contact/EmailTemplate', () => ({
  default: () => null,
}))

vi.mock('@/components/contact/AutoReplyEmail', () => ({
  AutoReplyEmail: () => null,
  getAutoReplySubject: () => 'Auto-reply',
}))

const initialState: FeedbackState = {
  status: 'idle',
  message: '',
  timestamp: 0,
}

function buildValidFormData(
  overrides?: Partial<Record<string, string>>,
) {
  const formData = new FormData()
  const payload = {
    email: 'test@example.com',
    firstName: 'Anh',
    lastName: 'Nguyen',
    service: 'Web Development',
    phone: '0123456789',
    message: 'Hello from vitest',
    locale: 'en',
    ...overrides,
  }

  for (const [key, value] of Object.entries(payload)) {
    formData.set(key, value)
  }

  return formData
}

async function loadSendEmail() {
  vi.resetModules()
  process.env.RESEND_API_KEY = 'test-api-key'
  process.env.CONTACT_RATE_LIMIT = '2'
  process.env.CONTACT_RATE_WINDOW_MS = '60000'
  process.env.CONTACT_MIN_REQUEST_INTERVAL_MS = '1000'

  const actionModule = await import('@/app/actions/actions')
  return actionModule.sendEmail
}

describe('sendEmail rate limiter (white-box)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-19T00:00:00.000Z'))

    resendMocks.send.mockClear()
    nextHeadersMocks.headers.mockReset()
    nextHeadersMocks.headers.mockResolvedValue(
      new Headers({
        'x-forwarded-for': '1.2.3.4',
        'user-agent': 'vitest-agent',
      }),
    )
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('blocks immediate repeated requests by minimum interval', async () => {
    const sendEmail = await loadSendEmail()
    const formData = buildValidFormData()

    const first = await sendEmail(initialState, formData)
    const second = await sendEmail(initialState, formData)

    expect(first.status).toBe('success')
    expect(second.status).toBe('error')
    expect(second.message).toContain('Too many requests')
    expect(resendMocks.send).toHaveBeenCalledTimes(2)
  })

  it('blocks when request count exceeds rate limit and resets after window', async () => {
    const sendEmail = await loadSendEmail()
    const formData = buildValidFormData()

    const first = await sendEmail(initialState, formData)

    vi.advanceTimersByTime(1100)
    const second = await sendEmail(initialState, formData)

    vi.advanceTimersByTime(1100)
    const third = await sendEmail(initialState, formData)

    expect(first.status).toBe('success')
    expect(second.status).toBe('success')
    expect(third.status).toBe('error')
    expect(third.message).toContain('Too many requests')

    vi.advanceTimersByTime(61000)
    const afterReset = await sendEmail(
      initialState,
      formData,
    )
    expect(afterReset.status).toBe('success')
  })

  it('does not consume rate limit budget on validation failures', async () => {
    const sendEmail = await loadSendEmail()

    const invalidForm = buildValidFormData({
      phone: '+84 123 456 789',
    })
    const invalidResult = await sendEmail(
      initialState,
      invalidForm,
    )
    expect(invalidResult.status).toBe('error')
    expect(invalidResult.message).toContain(
      'Validation failed',
    )

    const validForm = buildValidFormData()
    const firstValid = await sendEmail(
      initialState,
      validForm,
    )
    expect(firstValid.status).toBe('success')
  })
})
