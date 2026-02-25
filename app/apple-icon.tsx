import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        borderRadius: 32,
        background: '#232b20',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          fontSize: 120,
          fontWeight: 700,
          color: '#c3d3b7',
          lineHeight: 1,
        }}
      >
        A
      </span>
    </div>,
    { ...size },
  )
}
