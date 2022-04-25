import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import RecruitmentNodejsTestStack from '../lib/recruitment-nodejs-test-stack';

describe('RecruitmentNodeJsTestStack Tests', () => {
  test('Validate stack resources', () => {
    const app = new cdk.App();
    const stack = new RecruitmentNodejsTestStack(app, 'MyTestStack');

    Template.fromStack(stack).hasResource('AWS::ApiGatewayV2::Api', {});
    Template.fromStack(stack).hasResource('AWS::ApiGatewayV2::Integration', {});
    Template.fromStack(stack).hasResource('AWS::ECS::TaskDefinition', {});
    Template.fromStack(stack).hasResource('AWS::Logs::LogGroup', {});
    Template.fromStack(stack).hasResource('AWS::IAM::Role', {});
    Template.fromStack(stack).hasResource('AWS::DynamoDB::Table', {});
    Template.fromStack(stack).hasResource('AWS::ECS::Service', {});
    Template.fromStack(stack).hasResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {});
    Template.fromStack(stack).hasResource('AWS::ApplicationAutoScaling::ScalableTarget', {});
    Template.fromStack(stack).hasResource('AWS::ApplicationAutoScaling::ScalingPolicy', {});
  });
});
