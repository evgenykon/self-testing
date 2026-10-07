const encoder = new TextEncoder()
const decoder = new TextDecoder()

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.trim()
  const out = new Uint8Array(clean.length >> 1)
  for (let i = 0; i < out.length; i++) {
    out[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16)
  }
  return out
}

function bytesToBase64(bytes: Uint8Array): string {
  const chunkSize = 0x8000
  let binary = ''
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i)
  }
  return out
}

function transform(data: Uint8Array, key: Uint8Array): Uint8Array {
  const out = new Uint8Array(data.length)
  for (let i = 0; i < data.length; i++) {
    const k = key[i % key.length]!
    out[i] = data[i]! ^ k ^ ((i * 31) & 0xff)
  }
  return out
}

export function randomKeyHex(bytes = 32): string {
  const data = new Uint8Array(bytes)
  globalThis.crypto.getRandomValues(data)
  return Array.from(data, byte => byte.toString(16).padStart(2, '0')).join('')
}

export function obfuscate(text: string, keyHex: string): string {
  return bytesToBase64(transform(encoder.encode(text), hexToBytes(keyHex)))
}

export function deobfuscate(blob: string, keyHex: string): string {
  return decoder.decode(transform(base64ToBytes(blob), hexToBytes(keyHex)))
}
