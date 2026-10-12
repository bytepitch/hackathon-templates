import { ValidationError } from '../../../shared/domain/errors.js';
import { Item } from './item.js';

describe('Item', () => {
  it('trims the name', () => {
    expect(Item.create('  Coffee ').name).toBe('Coffee');
  });

  it('has no id until it is saved', () => {
    expect(Item.create('Coffee').id).toBeNull();
  });

  it('rejects an empty name', () => {
    expect(() => Item.create('   ')).toThrow(ValidationError);
  });

  it('rejects a name longer than 100 characters', () => {
    expect(() => Item.create('a'.repeat(101))).toThrow(ValidationError);
  });
});
