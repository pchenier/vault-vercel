// Encryption at rest for third-party tokens, byte-compatible with the Flask
// dashboard's crypto_util.py (Python `cryptography` Fernet):
//   key  = HKDF-SHA256(TOKEN_ENC_KEY || JWT_SECRET, salt "fiscit-token-encryption", info "v1", 32 bytes)
//   token = 0x80 | timestamp(8) | iv(16) | AES-128-CBC(ciphertext) | HMAC-SHA256(32), base64url
// Stored as "enc:v1:<token>"; values without the prefix are legacy plaintext.
import { createCipheriv, createDecipheriv, createHmac, hkdfSync, randomBytes, timingSafeEqual } from 'crypto'

const PREFIX = 'enc:v1:'

function keys() {
  const secret = process.env.TOKEN_ENC_KEY?.trim() || process.env.JWT_SECRET || ''
  if (!secret) throw new Error('No encryption secret configured')
  const k = Buffer.from(hkdfSync('sha256', secret, 'fiscit-token-encryption', 'v1', 32))
  return { signing: k.subarray(0, 16), encryption: k.subarray(16, 32) }
}

const b64url = (b: Buffer) => b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
const fromB64url = (s: string) => Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64')

export function encryptToken(plain: string | null | undefined): string | null {
  if (plain == null || plain === '' || plain.startsWith(PREFIX)) return plain ?? null
  const { signing, encryption } = keys()
  const iv = randomBytes(16)
  const ts = Buffer.alloc(8)
  ts.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 1000)))
  const cipher = createCipheriv('aes-128-cbc', encryption, iv)
  const body = Buffer.concat([Buffer.from([0x80]), ts, iv, cipher.update(plain, 'utf8'), cipher.final()])
  const mac = createHmac('sha256', signing).update(body).digest()
  return PREFIX + b64url(Buffer.concat([body, mac]))
}

export function decryptToken(stored: string | null | undefined): string | null {
  if (!stored || !stored.startsWith(PREFIX)) return stored ?? null
  const { signing, encryption } = keys()
  const raw = fromB64url(stored.slice(PREFIX.length))
  const body = raw.subarray(0, raw.length - 32)
  const mac = raw.subarray(raw.length - 32)
  const expected = createHmac('sha256', signing).update(body).digest()
  if (raw[0] !== 0x80 || mac.length !== 32 || !timingSafeEqual(mac, expected)) throw new Error('Invalid encrypted token')
  const iv = body.subarray(9, 25)
  const decipher = createDecipheriv('aes-128-cbc', encryption, iv)
  return Buffer.concat([decipher.update(body.subarray(25)), decipher.final()]).toString('utf8')
}
