import SseParser, { SseParserOptions } from '@jswork/sse-parser';

export type SseEvents = {
  onOpen?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
  onClose?: (event: CloseEvent) => void;
};

export type SseFetchOptions = RequestInit & SseEvents & {
  parserOptions?: SseParserOptions;
};

/**
 * Custom error class for SseFetch.
 * @class SseFetchError
 */
class SseFetchError extends Error {
  public type: string;

  constructor(message: string, type: string) {
    super(message);
    this.name = 'SseFetchError';
    this.type = type;
  }
}

const defaults: SseFetchOptions = {
  parserOptions: { type: 'standard' },
};

const sseFetch = async (inUrl: string, inOptions: SseFetchOptions) => {
  const { parserOptions, onOpen, onMessage, onClose, ...options } = { ...defaults, ...inOptions };
  const response = await fetch(inUrl, options).catch((error) => {
    throw new SseFetchError(`Failed to fetch ${inUrl}: ${error}`, 'fetch-error');
  });

  if (!response.ok) {
    throw new SseFetchError(`Failed to fetch ${inUrl}: ${response.status} ${response.statusText}`, 'fetch-error');
  }

  if (!response.body) {
    throw new SseFetchError(`Failed to fetch ${inUrl}: response body is empty`, 'fetch-error');
  }

  onOpen?.(new Event('open'));

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
      callback: ({ item }) => {
        const event = new MessageEvent('message', { data: item });
        onMessage?.(event);
      },
      ...parserOptions,
    });
  }
};

export default sseFetch;
