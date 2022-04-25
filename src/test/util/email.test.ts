import { validateEmail } from '../../util/email';

describe('Email util tests', () => {
  test('Valid email', async () => {
    const valid = validateEmail('valid@email.com');
    expect(valid).toBe(true);
  });
  test('Invalid email', async () => {
    const valid = validateEmail('a');
    expect(valid).toBe(false);
  });
  test('Empty email', async () => {
    const valid = validateEmail('');
    expect(valid).toBe(false);
  });
  test('Space  email', async () => {
    const valid = validateEmail(' ');
    expect(valid).toBe(false);
  });
  test('Invalid email with dot in the end', async () => {
    const valid = validateEmail('abc@abc.');
    expect(valid).toBe(false);
  });
  test('Invalid email with two @', async () => {
    const valid = validateEmail('abc@abc@.com');
    expect(valid).toBe(false);
  });
});
