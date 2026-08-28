# make-base64

Encode strings and binary data as Base64 with configurable symbols and padding.

## Usage

```ts
import makeBase64 from 'make-base64'

makeBase64('hello') // 'aGVsbG8'
makeBase64('hello', {pad: true}) // 'aGVsbG8='

makeBase64(new Uint8Array([251, 255])) // '-_8'
makeBase64(new Uint8Array([251, 255]), {symbols: 'base64'}) // '+/8'
makeBase64(new Uint8Array([251, 255]), {symbols: ['.', '~']}) // '.~8'

makeBase64('f', {pad: '.'}) // 'Zg..'
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `pad` | `boolean \| string` | `false` | Pad to a multiple of 4 symbols. `true` uses `=`; a string uses that string. |
| `symbols` | `[string, string] \| 'base64' \| 'base64url'` | `'base64url'` | Symbols for digits 62 and 63, or a predefined symbol set. |

Strings are encoded as UTF-8. Binary input can be an `ArrayBuffer` or any `ArrayBufferView`.
