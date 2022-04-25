import { BadRequestError } from '../../util/error';

describe('Error tests', () => {
  test('BadRequestError error', async () => {
    const error = new BadRequestError({
      name: 'Invalid error', message: 'Invalid error message', status: 400, silent: false,
    });
    expect(error.message).toBe('Invalid error message');
    expect(error.status).toBe(400);
    expect(error.silent).toBe(false);
  });
  test('BadRequestError silent error with no status', async () => {
    const error = new BadRequestError({
      name: 'Invalid error', message: 'Invalid error message', silent: true,
    });
    expect(error.message).toBe('Invalid error message');
    expect(error.status).toBe(500);
    expect(error.silent).toBe(true);
  });
});
