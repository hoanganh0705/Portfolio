'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { sendEmail } from '@/app/actions/actions'
import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react'
import toast from 'react-hot-toast'
import type { FeedbackState } from '@/types/contact'
import { useLocale } from '@/lib/locale-context'

// rendering-hoist-jsx: hoist static initial state outside component
const initialState: FeedbackState = {
  status: 'idle',
  message: '',
  timestamp: Date.now(),
}

export default function ContactForm() {
  const { locale, dict } = useLocale()
  const [service, setService] = useState('')
  const [response, action, isPending] = useActionState(
    sendEmail,
    initialState,
  )
  const formRef = useRef<HTMLFormElement>(null)
  const lastToastIdRef = useRef<string | null>(null)

  useEffect(() => {
    // js-early-exit: return early if no response message
    if (!response?.message) return

    if (lastToastIdRef.current) {
      toast.dismiss(lastToastIdRef.current)
    }

    // rendering-conditional-render: explicit ternary
    const id =
      response.status === 'success'
        ? toast.success(response.message)
        : toast.error(response.message)

    lastToastIdRef.current = id

    // Reset form on success
    if (response.status === 'success') {
      formRef.current?.reset()
      setService('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- timestamp is the trigger; response ref is stable per submission
  }, [response?.timestamp])

  return (
    <div className='xl:w-[70%] order-2 xl:order-0'>
      <form
        ref={formRef}
        action={action}
        className='flex flex-col gap-6 p-10 bg-secondary rounded-xl'
      >
        <p className='text-4xl text-accent-default'>
          {dict.contact.title}
        </p>
        <p className='text-muted-foreground'>
          {dict.contact.description}
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Input
            name='firstName'
            type='text'
            placeholder={dict.contact.firstname}
            defaultValue=''
          />
          <Input
            name='lastName'
            type='text'
            placeholder={dict.contact.lastname}
            defaultValue=''
          />
          <Input
            name='email'
            type='email'
            placeholder={dict.contact.email}
            defaultValue=''
          />
          <Input
            name='phone'
            type='text'
            placeholder={dict.contact.phone}
            defaultValue=''
          />
        </div>

        <Select
          aria-label={dict.contact.selectService}
          value={service}
          onValueChange={setService}
        >
          <SelectTrigger
            className='w-full'
            aria-label={dict.contact.selectService}
          >
            <SelectValue
              placeholder={dict.contact.selectService}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>
                {dict.contact.selectService}
              </SelectLabel>
              <SelectItem value='Web Development'>
                {dict.contact.serviceOptions.webDev}
              </SelectItem>
              <SelectItem value='SEO'>
                {dict.contact.serviceOptions.seo}
              </SelectItem>
              <SelectItem value='English Teacher'>
                {dict.contact.serviceOptions.teaching}
              </SelectItem>
              <SelectItem value='Private Tutor'>
                {dict.contact.serviceOptions.tutoring}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Honeypot field — hidden from humans, filled by bots */}
        <input
          name='website'
          type='text'
          defaultValue=''
          autoComplete='off'
          tabIndex={-1}
          aria-hidden='true'
          style={{
            position: 'absolute',
            opacity: 0,
            top: 0,
            left: 0,
            height: 0,
            width: 0,
            zIndex: -1,
            pointerEvents: 'none',
          }}
        />

        {/* Hidden inputs for service and locale */}
        <input
          type='hidden'
          name='service'
          value={service}
        />
        <input type='hidden' name='locale' value={locale} />

        <Textarea
          name='message'
          className='h-[200px]'
          placeholder={dict.contact.message}
        />

        <Button
          className='max-w-40'
          disabled={isPending}
          aria-disabled={isPending}
        >
          {isPending ? (
            <div
              className='loader text-[3px]'
              aria-label={dict.contact.sending}
              role='status'
            />
          ) : (
            dict.contact.send
          )}
        </Button>
      </form>
    </div>
  )
}
