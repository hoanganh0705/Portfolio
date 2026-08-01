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

const ratelimitMocks = vi.hoisted(() => ({
  instances: [] as Array<{
    self: unknown
    config: { limit: number; windowMs: number }
  }>,
  nextLimitResult: {
    success: true,
    remaining: 5,
    reset: 0,
  } as { success: boolean; remaining: number; reset: number },
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

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: class {
    limit = vi.fn(async () => ratelimitMocks.nextLimitResult)

    constructor(config: {
      limiter: { tokens: number; window: number }
      prefix?: string
    }) {
      // Push `this` so tests can swap `instance.limit` and have it take
      // effect on the cached limiter inside `lib/redis.ts`.
      ratelimitMocks.instances.push({
        self: this,
        config: {
          limit: config.limiter.tokens,
          windowMs: config.limiter.window,
        },
      })
    }

    static slidingWindow(limit: number, window: string) {
      return { tokens: limit, window: Number.parseInt(window, 10) }
    }
  },
}))

vi.mock('@upstash/redis', () => ({
  Redis: class {
    constructor(_opts: { url: string; token: string }) {}
  },
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

async function loadSendEmailWithFallback() {
  vi.resetModules()
  // Ensure tests always exercise the in-memory fallback path.
  delete process.env.UPSTASH_REDIS_REST_URL
  delete process.env.UPSTASH_REDIS_REST_TOKEN
  process.env.RESEND_API_KEY = 'test-api-key'
  process.env.CONTACT_RATE_LIMIT = '2'
  process.env.CONTACT_RATE_WINDOW_MS = '60000'
  process.env.CONTACT_MIN_REQUEST_INTERVAL_MS = '1000'

  const actionModule = await import('@/app/actions/actions')
  return actionModule.sendEmail
}

async function loadSendEmailWithUpstash(
  limit: string,
  windowMs: string,
  minIntervalMs: string,
) {
  vi.resetModules()
  process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io'
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token'
  process.env.RESEND_API_KEY = 'test-api-key'
  process.env.CONTACT_RATE_LIMIT = limit
  process.env.CONTACT_RATE_WINDOW_MS = windowMs
  process.env.CONTACT_MIN_REQUEST_INTERVAL_MS = minIntervalMs

  const actionModule = await import('@/app/actions/actions')
  return actionModule.sendEmail
}

describe('sendEmail rate limiter (in-memory fallback)', () => {
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
    const sendEmail = await loadSendEmailWithFallback()
    const formData = buildValidFormData()

    const first = await sendEmail(initialState, formData)
    const second = await sendEmail(initialState, formData)

    expect(first.status).toBe('success')
    expect(second.status).toBe('error')
    expect(second.message).toContain('Too many requests')
    expect(resendMocks.send).toHaveBeenCalledTimes(2)
  })

  it('blocks when request count exceeds rate limit and resets after window', async () => {
    const sendEmail = await loadSendEmailWithFallback()
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
    const sendEmail = await loadSendEmailWithFallback()

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

describe('sendEmail rate limiter (Upstash distributed)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-19T00:00:00.000Z'))

    resendMocks.send.mockClear()
    nextHeadersMocks.headers.mockReset()
    nextHeadersMocks.headers.mockResolvedValue(
      new Headers({
        'x-forwarded-for': '5.6.7.8',
        'user-agent': 'upstash-test-agent',
      }),
    )
    ratelimitMocks.instances.length = 0
    ratelimitMocks.nextLimitResult = {
      success: true,
      remaining: 5,
      reset: Date.now() + 60000,
    }
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('uses Upstash with sliding window when env vars are configured', async () => {
    const sendEmail = await loadSendEmailWithUpstash('5', '60000', '0')
    const result = await sendEmail(initialState, buildValidFormData())

    expect(result.status).toBe('success')
    expect(ratelimitMocks.instances.length).toBe(1)
    // Sliding window config reflects the env vars.
    expect(ratelimitMocks.instances[0].config.limit).toBe(5)
    expect(ratelimitMocks.instances[0].config.windowMs).toBe(60000)
  })

  it('blocks when Upstash returns success=false', async () => {
    ratelimitMocks.nextLimitResult = {
      success: false,
      remaining: 0,
      reset: Date.now() + 60000,
    }

    const sendEmail = await loadSendEmailWithUpstash('5', '60000', '0')
    const result = await sendEmail(initialState, buildValidFormData())

    expect(result.status).toBe('error')
    expect(result.message).toContain('Too many requests')
    // When rate-limited, the email must NOT have been sent.
    expect(resendMocks.send).not.toHaveBeenCalled()
  })

  it('fails open when Upstash throws', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const sendEmail = await loadSendEmailWithUpstash('5', '60000', '0')

    // Trigger the lazy limiter creation by calling sendEmail once
    // (mock returns success, so the email sends normally).
    const first = await sendEmail(initialState, buildValidFormData())
    expect(first.status).toBe('success')

    // Now replace the limit() method on the actual instance with a
    // throwing one so the next call exercises the fail-open path.
    const entry = ratelimitMocks.instances[0]
    expect(entry).toBeDefined()
    ;(entry.self as { limit: ReturnType<typeof vi.fn> }).limit = vi.fn(
      async () => {
        throw new Error('Upstash unreachable')
      },
    )

    const result = await sendEmail(initialState, buildValidFormData())

    expect(result.status).toBe('success')
    expect(errorSpy).toHaveBeenCalledWith(
      '[rate-limit] Upstash error, failing open:',
      expect.any(Error),
    )
    errorSpy.mockRestore()
  })
})