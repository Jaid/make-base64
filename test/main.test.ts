import {describe, expect, test} from 'bun:test'

import makeBase64 from '#src/main.ts'

describe('makeBase64', () => {
  test('uses URL-safe unpadded defaults', () => {
    expect(makeBase64('f')).toBe('Zg')
    expect(makeBase64(new Uint8Array([251, 255]))).toBe('-_8')
  })
  test('supports padding', () => {
    expect(makeBase64('f', {pad: true})).toBe('Zg==')
    expect(makeBase64('fo', {pad: true})).toBe('Zm8=')
    expect(makeBase64('foo', {pad: true})).toBe('Zm9v')
  })
  test('supports custom digits 62 and 63', () => {
    expect(makeBase64(new Uint8Array([251, 255]), {
      digit62: '+',
      digit63: '/',
    })).toBe('+/8')
  })
  test('encodes strings as UTF-8', () => {
    expect(makeBase64('✓')).toBe('4pyT')
  })
  test('respects ArrayBufferView offsets', () => {
    const bytes = new Uint8Array([0, 102, 111, 111, 0])
    expect(makeBase64(bytes.subarray(1, 4))).toBe('Zm9v')
  })
})
