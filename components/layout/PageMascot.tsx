'use client'

import { Mascot } from 'page-mascot'

export default function PageMascot() {
  return (
    <Mascot
      size={80}
      directions='/mascots/anh-directions.webp'
      reactions='/mascots/anh-reactions.webp'
      label='Anh'
      className='page-mascot-header'
    />
  )
}
