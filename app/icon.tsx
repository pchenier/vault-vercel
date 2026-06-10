import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: '#0e0e0e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="26" height="26" viewBox="0 0 20 20">
          <polygon
            points="2,3 7,3 10,15 13,3 18,3 10,19"
            fill="#b8f566"
          />
        </svg>
      </div>
    ),
    { ...size }
  )
}
