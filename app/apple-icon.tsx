import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        borderRadius: 32,
        background: '#1A202C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          fontSize: 120,
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
