# make-base64

Encode strings and binary data as Base64 with configurable digits 62 and 63.

## Usage

```ts
import makeBase64 from 'make-base64'

makeBase64('hello') // 'aGVsbG8'
makeBase64('hello', {pad: true}) // 'aGVsbG8='

makeBase64(new Uint8Array([251, 255])) // '-_8'
makeBase64(new Uint8Array([251, 255]), {
  digit62: '+',
  digit63: '/',
  pad: true,
}) // '+/8='
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `pad` | `boolean` | `false` | Append `=` padding to a multiple of 4 characters. |
| `digit62` | `string` | `'-'` | Output string for Base64 digit 62. |
| `digit63` | `string` | `'_'` | Output string for Base64 digit 63. |

Strings are encoded as UTF-8. Binary input can be an `ArrayBuffer` or any `ArrayBufferView`.
