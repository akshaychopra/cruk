import { Request, Response } from 'express';
import { DonationHandler } from '../../handlers/donation';
import { WinstonLogger } from '../../util/logger';

const mockDynamoDbUpdate = jest.fn(() => ({
  promise() {
    return Promise.resolve({
      Attributes: {
        donations: [{ amount: 300 }],
        id: 'testemail@email.com',
      },
    });
  },
}));

jest.mock('aws-sdk', () => ({
  config: {
    update: jest.fn(),
  },
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      update: mockDynamoDbUpdate,
    })),
  },
  SES: jest.fn(() => ({
    sendEmail: jest.fn(() => ({
      promise() {
        return Promise.resolve({});
      },
    })),
  })),
}));

const handler = new DonationHandler();

const request = {} as Request;
const response = {
  json: jest.fn((result) => result),
  status: jest.fn(() => ({
    json: jest.fn(() => ({
      end: jest.fn(),
    })),
  })),
} as unknown as Response;

beforeEach(() => {
  jest.clearAllMocks();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const wLogger = new WinstonLogger('dev');
  process.env.DONATIONS_TABLE = 'donationsTable:ARN';
  process.env.FROM_EMAIL = 'fromEmailAddress';
});

describe('Donation handler tests', () => {
  test('Create valid donation', async () => {
    request.body = { user: 'testemail@email.com', amount: 300 };
    const result = await handler.donate(request, response);
    expect(result).toMatchObject({ id: 'testemail@email.com', donations: [{ amount: 300 }] });
    expect(mockDynamoDbUpdate).toHaveBeenCalledWith({
      TableName: 'donationsTable:ARN',
      Key: { id: 'testemail@email.com' },
      UpdateExpression: 'SET donations = list_append(if_not_exists(donations, :empty_list),:vals)',
      ExpressionAttributeValues: {
        ':vals': [expect.objectContaining({ amount: 300, createdAt: expect.anything() })],
        ':empty_list': [],
      },
    });
  });
});

// TODO error response not propagated properly as underlying mock implementations for responses will have to be implemented
// for now, look whether the response is not defined and look for actual expected errors later
test('Create donation invalid email', async () => {
  request.body = { user: 'testemail@email', amount: 300 };
  const result = await handler.donate(request, response);
  expect(result).not.toBeDefined();
});

test('Create donation invalid amount', async () => {
  request.body = { user: 'testemail@email', amount: -100 };
  const result = await handler.donate(request, response);
  expect(result).not.toBeDefined();
});
