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
          background: '#0A0F1A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* F letter */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ width: 5, height: 20, background: '#F0F4F8', borderRadius: 2 }} />
          <div style={{ width: 16, height: 5, background: '#F0F4F8', borderRadius: 2, position: 'absolute', top: 0, left: 0 }} />
          <div style={{ width: 12, height: 4, background: '#F0F4F8', borderRadius: 2, position: 'absolute', top: 8, left: 0 }} />
        </div>
        {/* Blue dot */}
        <div style={{
          width: 7,
          height: 7,
          borderRadius: 7,
          background: '#b8f566',
          position: 'absolute',
          top: 3,
          right: 0,
        }} />
      </div>
    ),
    { ...size }
  )
}