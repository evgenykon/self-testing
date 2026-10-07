import { describe, expect, it } from 'vitest'
import { deobfuscate, obfuscate, randomKeyHex } from '../shared/obfuscate.ts'

describe('obfuscate', () => {
  it('обратим для ascii, кириллицы и юникода', () => {
    const key = randomKeyHex()
    const text = 'Проверка: $E = mc^2$ — тест 🎓\n{"a":1}'
    expect(deobfuscate(obfuscate(text, key), key)).toBe(text)
  })

  it('обратим для больших данных', () => {
    const key = randomKeyHex()
    const text = 'повторяющийся текст '.repeat(50_000)
    expect(deobfuscate(obfuscate(text, key), key)).toBe(text)
  })

  it('не содержит исходный текст и корректный base64', () => {
    const key = randomKeyHex()
    const text = 'секретный правильный ответ'
    const blob = obfuscate(text, key)
    expect(blob).not.toContain(text)
    expect(blob).toMatch(/^[A-Za-z0-9+/]+=*$/)
  })

  it('не расшифровывается другим ключом', () => {
    const blob = obfuscate('данные', randomKeyHex())
    expect(() => deobfuscate(blob, randomKeyHex())).not.toThrow()
    expect(deobfuscate(blob, randomKeyHex())).not.toBe('данные')
  })

  it('генерирует ключ нужной длины и формата', () => {
    const key = randomKeyHex(32)
    expect(key).toMatch(/^[0-9a-f]{64}$/)
    expect(randomKeyHex(16)).toMatch(/^[0-9a-f]{32}$/)
  })
})
