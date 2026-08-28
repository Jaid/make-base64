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

export const makeBase64 = (input: Input, options: Options = {}) => {
  const symbols = getSymbols(options.symbols)
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
    output.push(symbols[byte0 >> 2])
    output.push(symbols[(byte0 & 0x03) << 4 | byte1 >> 4])
    output.push(symbols[(byte1 & 0x0F) << 2 | byte2 >> 6])
    output.push(symbols[byte2 & 0x3F])
  }
  const remainder = bytes.length - fullLength
  if (remainder === 1) {
    const byte0 = bytes[fullLength]
    output.push(symbols[byte0 >> 2])
    output.push(symbols[(byte0 & 0x03) << 4])
    pad()
    pad()
  } else if (remainder === 2) {
    const byte0 = bytes[fullLength]
    const byte1 = bytes[fullLength + 1]
    output.push(symbols[byte0 >> 2])
    output.push(symbols[(byte0 & 0x03) << 4 | byte1 >> 4])
    output.push(symbols[(byte1 & 0x0F) << 2])
    pad()
  }
  return output.join('')
}

export default makeBase64
