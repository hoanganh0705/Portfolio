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

// rendering-hoist-jsx: hoist static initial state outside component
const initialState: FeedbackState = {
  status: 'idle',
  message: '',
  timeStamp: Date.now(),
}

export default function ContactForm() {
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
  }, [response, response?.timeStamp])

  return (
    <div className='xl:w-[70%] order-2 xl:order-0'>
      <form
        ref={formRef}
        action={action}
        className='flex flex-col gap-6 p-10 bg-[#27272c] rounded-xl'
      >
        <p className='text-4xl text-accent-default'>
          Let&rsquo;s work together
        </p>
        <p className='text-white/60'>
          Ready to bring your vision to life? Whether you
          need a stunning website, personalized tutoring,
          English mastery, or top-tier SEO, I’m here to
          deliver exceptional results. Let’s connect and
          create something extraordinary!
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Input
            name='firstName'
            type='text'
            placeholder='First name'
            defaultValue=''
          />
          <Input
            name='lastName'
            type='text'
            placeholder='Last name'
            defaultValue=''
          />
          <Input
            name='email'
            type='email'
            placeholder='Email'
            defaultValue=''
          />
          <Input
            name='phone'
            type='text'
            placeholder='Phone'
            defaultValue=''
          />
        </div>

        <Select
          aria-label='Choose a service'
          value={service}
          onValueChange={setService}
        >
          <SelectTrigger
            className='w-full'
            aria-label='Choose a service'
          >
            <SelectValue placeholder='Select a service' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Choose a service</SelectLabel>
              <SelectItem value='Web Development'>
                Web Development
              </SelectItem>
              <SelectItem value='SEO'>SEO</SelectItem>
              <SelectItem value='English Teacher'>
                English Teacher
              </SelectItem>
              <SelectItem value='Private Tutor'>
                Private Tutor
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Hidden input to include service in form data */}
        <input
          type='hidden'
          name='service'
          value={service}
        />

        <Textarea
          name='message'
          className='h-[200px]'
          placeholder='Type your message here...'
        />

        <Button
          className='max-w-40'
          disabled={isPending}
          aria-disabled={isPending}
        >
          {isPending ? (
            <div
              className='loader text-[3px]'
              aria-label='Sending...'
              role='status'
            />
          ) : (
            'Send'
          )}
        </Button>
      </form>
    </div>
  )
}
