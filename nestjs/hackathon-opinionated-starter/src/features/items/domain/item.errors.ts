import { NotFoundError } from '../../../shared/domain/errors.js';

export class ItemNotFoundError extends NotFoundError {
  constructor(id: number) {
    super(`Item ${id} not found`);
  }
}
