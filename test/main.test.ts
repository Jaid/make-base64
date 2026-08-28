import {expect, test} from 'bun:test'

const {default: makeBase64} = await import('#src/main.ts')

test('should run', () => {
  const result = makeBase64()
  expect(result).toBe('make-base64') // TODO Test actual functionality
})
