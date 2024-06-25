# sse-fetch
> Server Sent Event (SSE) streaming via `fetch`.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```shell
npm install @jswork/sse-fetch
```

## usage
```js
import sseFetch from '@jswork/sse-fetch';

sseFetch('https://example.com/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'hello' }),
  parserOptions: {
    type: 'prefixedJson',
  },
  onMessage: function(event) {
    console.log(event.data);
  },
  onClose: function() {
    console.log('close');
  },
});
```

## license
Code released under [the MIT license](https://github.com/afeiship/sse-fetch/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/sse-fetch
[version-url]: https://npmjs.org/package/@jswork/sse-fetch

[license-image]: https://img.shields.io/npm/l/@jswork/sse-fetch
[license-url]: https://github.com/afeiship/sse-fetch/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/sse-fetch
[size-url]: https://github.com/afeiship/sse-fetch/blob/master/dist/index.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/sse-fetch
[download-url]: https://www.npmjs.com/package/@jswork/sse-fetch
