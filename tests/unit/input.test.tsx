import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder='Email address' />)
    expect(
      screen.getByPlaceholderText('Email address'),
    ).toBeInTheDocument()
  })

  it('keeps provided input type', () => {
    render(<Input type='email' aria-label='email-input' />)
    expect(
      screen.getByLabelText('email-input'),
    ).toHaveAttribute('type', 'email')
  })
})
