import SseParser, { SseParserOptions } from '@jswork/sse-parser';

export type SseEvents = {
  onMessage?: (event: MessageEvent) => void;
  onClose?: (event: CloseEvent) => void;
};

export type SseFetchOptions = RequestInit & SseEvents & {
  parserOptions?: SseParserOptions;
};

const defaults: SseFetchOptions = {
  parserOptions: { type: 'standard' },
};

const sseFetch = async (inUrl: string, inOptions: SseFetchOptions) => {
  const { parserOptions, onMessage, onClose, ...options } = { ...defaults, ...inOptions };
  const response = await fetch(inUrl, options).catch((error) => {
    throw new Error(`Failed to fetch ${inUrl}: ${error}`);
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${inUrl}: ${response.status} ${response.statusText}`);
  }

  if (!response.body) {
    throw new Error(`Failed to fetch ${inUrl}: response body is empty`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      onClose?.(new CloseEvent('close'));
      break;
    }

    const chunk = decoder.decode(value);

    SseParser.parse(chunk, {
      ...parserOptions,
      callback: ({ item }) => {
        const event = new MessageEvent('message', { data: item });
        onMessage?.(event);
      },
    });
  }
};

export default sseFetch;
