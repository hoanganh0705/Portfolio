import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Hire me</Button>)
    expect(
      screen.getByRole('button', { name: 'Hire me' }),
    ).toBeInTheDocument()
  })

  it('applies outline variant classes', () => {
    render(<Button variant='outline'>Outline</Button>)
    const button = screen.getByRole('button', {
      name: 'Outline',
    })
    expect(button.className).toContain(
      'border-accent-default',
    )
  })
})
