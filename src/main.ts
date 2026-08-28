interface Options {
  pad?: boolean | string
  symbols?: [string, string] | 'base64' | 'base64url'
}

type Input = ArrayBuffer | ArrayBufferView | string

const toBytes = (input: Input) => {
  if (typeof input === 'string') {
    const textEncoder = new TextEncoder
    return textEncoder.encode(input)
  }
  if (ArrayBuffer.isView(input)) {
    return new Uint8Array(input.buffer, input.byteOffset, input.byteLength)
  }
  return new Uint8Array(input)
}
const getSymbols = (symbols: Options['symbols'] = 'base64url') => {
  const baseSymbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  if (symbols === 'base64') {
    return [...baseSymbols, '+', '/']
  }
  if (symbols === 'base64url') {
    return [...baseSymbols, '-', '_']
  }
  return [...baseSymbols, ...symbols]
}
const makeBase64 = (input: Input, options: Options = {}) => {
  const symbols = getSymbols(options.symbols)
  const bytes = toBytes(input)
  const fullLength = bytes.length - bytes.length % 3
  let output = ''
  for (let index = 0; index < fullLength; index += 3) {
    const byte0 = bytes[index]
    const byte1 = bytes[index + 1]
    const byte2 = bytes[index + 2]
    output += symbols[byte0 >> 2]
    output += symbols[(byte0 & 0x03) << 4 | byte1 >> 4]
    output += symbols[(byte1 & 0x0F) << 2 | byte2 >> 6]
    output += symbols[byte2 & 0x3F]
  }
  const remainder = bytes.length - fullLength
  if (!remainder) {
    return output
  }
  const getPadString = () => {
    if (!options.pad) {
      return ''
    }
    if (options.pad === true) {
      return '='
    }
    return options.pad
  }
  const pad = getPadString()
  if (remainder === 1) {
    const byte0 = bytes[fullLength]
    output += symbols[byte0 >> 2]
    output += symbols[(byte0 & 0x03) << 4]
    return output + pad + pad
  }
  const byte0 = bytes[fullLength]
  const byte1 = bytes[fullLength + 1]
  output += symbols[byte0 >> 2]
  output += symbols[(byte0 & 0x03) << 4 | byte1 >> 4]
  output += symbols[(byte1 & 0x0F) << 2]
  return output + pad
}

export default makeBase64
