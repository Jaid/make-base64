export interface MakeBase64Options {
  digit62?: string
  digit63?: string
  pad?: boolean | string
}

export type MakeBase64Input = ArrayBuffer | ArrayBufferView | string

const toBytes = (input: MakeBase64Input) => {
  if (typeof input === 'string') {
    return (new TextEncoder).encode(input)
  }
  if (ArrayBuffer.isView(input)) {
    return new Uint8Array(input.buffer, input.byteOffset, input.byteLength)
  }
  return new Uint8Array(input)
}

export const makeBase64 = (input: MakeBase64Input, options: MakeBase64Options = {}) => {
  const encodeDigit = (value: number) => {
    if (value === 62) {
      return options.digit62
    }
    if (value === 63) {
      return options.digit63
    }
    if (value < 26) {
      return String.fromCodePoint(65 + value)
    }
    if (value < 52) {
      return String.fromCodePoint(97 + value - 26)
    }
    return String.fromCodePoint(48 + value - 52)
  }
  const bytes = toBytes(input)
  const fullLength = bytes.length - bytes.length % 3
  const output: Array<string> = []
  const pad = () => {
    if (!options.pad) {
      return
    }
    const padString = options.pad === true ? '=' : options.pad
    output.push(padString)
  }
  for (let index = 0; index < fullLength; index += 3) {
    const byte0 = bytes[index]
    const byte1 = bytes[index + 1]
    const byte2 = bytes[index + 2]
    output.push(encodeDigit(byte0 >> 2), encodeDigit((byte0 & 0x03) << 4 | byte1 >> 4), encodeDigit((byte1 & 0x0F) << 2 | byte2 >> 6), encodeDigit(byte2 & 0x3F))
  }
  const remainder = bytes.length - fullLength
  if (remainder === 1) {
    const byte0 = bytes[fullLength]
    output.push(encodeDigit(byte0 >> 2), encodeDigit((byte0 & 0x03) << 4))
    pad()
    pad()
  } else if (remainder === 2) {
    const byte0 = bytes[fullLength]
    const byte1 = bytes[fullLength + 1]
    output.push(encodeDigit(byte0 >> 2), encodeDigit((byte0 & 0x03) << 4 | byte1 >> 4), encodeDigit((byte1 & 0x0F) << 2))
    pad()
  }
  return output.join('')
}

export default makeBase64
