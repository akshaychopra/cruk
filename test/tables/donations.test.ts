import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import RecruitmentNodejsTestStack from '../../lib/recruitment-nodejs-test-stack';
import DonationsTable from '../../lib/tables/donations';

describe('DonationsTable tests', () => {
  test('DynamoDB creation', () => {
    const app = new cdk.App();
    const stack = new RecruitmentNodejsTestStack(app, 'TestStack');
    const table = new DonationsTable(stack, 'TestConstruct');

    Template.fromStack(stack).hasResource('AWS::DynamoDB::Table', {
      Properties: {
        BillingMode: 'PAY_PER_REQUEST',
        KeySchema: [
          {
            AttributeName: 'id',
            KeyType: 'HASH',
          },
        ],
        AttributeDefinitions: [
          {
            AttributeName: 'id',
            AttributeType: 'S',
          },
        ],
      },
    });
    expect(table.table).toBeDefined();
  });
});
