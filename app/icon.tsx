import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        background: '#1A202C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#FF5733',
          lineHeight: 1,
        }}
      >
        A
      </span>
    </div>,
    { ...size },
  )
}
