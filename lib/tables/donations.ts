import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { RemovalPolicy } from '@aws-cdk/core';

export const DONATIONS_TABLE = 'DonationsTable';

export default class DonationsTable extends cdk.Construct {
  public readonly table: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this.table = new dynamodb.Table(this, DONATIONS_TABLE, {
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });
  }
}
