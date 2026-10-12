import { describe, expect, it } from 'vitest';
import { ApiError } from './client';

describe('ApiError', () => {
  it.each([
    ['a message string', { message: 'Not found' }, 'Not found'],
    [
      'a list of messages',
      { message: ['name must be a string', 'name is too long'] },
      'name must be a string, name is too long',
    ],
    ['a detail string', { detail: 'Not found' }, 'Not found'],
    [
      'a list of { msg } details',
      { detail: [{ loc: ['body', 'name'], msg: 'Field required' }] },
      'Field required',
    ],
    ['an unknown shape', { oops: true }, 'Request failed with status 400'],
    ['no body', undefined, 'Request failed with status 400'],
  ])('reads %s', (_, body, expected) => {
    expect(new ApiError(400, body).message).toBe(expected);
  });
});
