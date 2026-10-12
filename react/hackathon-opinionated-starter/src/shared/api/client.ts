import createClient from 'openapi-fetch';
import type { paths } from './schema';

// In development the Vite dev server proxies /api to the API (see vite.config.ts),
// so requests go to the page's own origin. A production build calls VITE_API_URL,
// or the page's origin if the API is served from the same domain
const baseUrl =
  import.meta.env.PROD && import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : window.location.origin;

// Typed client: paths, params, bodies and responses all come from schema.d.ts
export const api = createClient<paths>({
  baseUrl,
  // Look fetch up on every call, so test mocks (MSW) that replace it are used
  fetch: (request) => globalThis.fetch(request),
});

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(messageFrom(body) ?? `Request failed with status ${status}`);
    this.status = status;
    this.body = body;
  }
}

// openapi-fetch returns errors instead of throwing them. TanStack Query
// expects a throw, so wrap every call: `queryFn: () => unwrap(api.GET(...))`
export async function unwrap<T>(
  request: Promise<{ data?: T; error?: unknown; response: Response }>,
): Promise<T> {
  const { data, error, response } = await request;
  if (!response.ok) throw new ApiError(response.status, error);
  return data as T;
}

// Back ends shape their error bodies differently. This reads the common ones:
// { message } (NestJS, Express, Spring) and { detail } (FastAPI, Django REST),
// where the value is a string or a list of strings or { msg } objects.
// Anything else falls back to "Request failed with status N"
function messageFrom(body: unknown): string | undefined {
  if (typeof body !== 'object' || body === null) return undefined;
  if ('message' in body) return toText(body.message);
  if ('detail' in body) return toText(body.detail);
  return undefined;
}

function toText(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (!Array.isArray(value)) return undefined;
  const parts = value
    .map((part: unknown) =>
      typeof part === 'string'
        ? part
        : typeof part === 'object' && part !== null && 'msg' in part
          ? String(part.msg)
          : undefined,
    )
    .filter((part) => part !== undefined);
  return parts.length > 0 ? parts.join(', ') : undefined;
}
