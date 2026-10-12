import type { paths } from './schema';

// Types for an endpoint's request and response bodies, looked up by path and
// method in schema.d.ts. They don't depend on what the API names its schemas
type JsonContent<T> = T extends { content: { 'application/json': infer Body } }
  ? Body
  : never;

type SuccessStatus = 200 | 201 | 202;

// The JSON a successful call returns, e.g. ResponseBody<'/api/items', 'get'>
export type ResponseBody<
  Path extends keyof paths,
  Method extends keyof paths[Path],
> =
  NonNullable<paths[Path][Method]> extends { responses: infer Responses }
    ? JsonContent<Responses[keyof Responses & SuccessStatus]>
    : never;

// The JSON a call sends, e.g. RequestBody<'/api/items', 'post'>
export type RequestBody<
  Path extends keyof paths,
  Method extends keyof paths[Path],
> =
  NonNullable<paths[Path][Method]> extends { requestBody?: infer Body }
    ? JsonContent<NonNullable<Body>>
    : never;
