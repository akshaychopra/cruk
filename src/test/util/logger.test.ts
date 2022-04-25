import { WinstonLogger } from '../../util/logger';

describe('Logger tests', () => {
  let logger: WinstonLogger;

  beforeAll(() => {
    logger = new WinstonLogger('production');
    logger.setupSentry = jest.fn(() => ({
      log: jest.fn(),
    }));
  });

  test('Global logger object is defined', async () => {
    expect(global.logger).toBeDefined();
  });

  test('Expect sentry to be defined', async () => {
    logger.setupSentry('dsn');
    expect(logger.setupSentry).toHaveBeenCalled();
  });
});
