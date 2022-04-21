import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from 'aws-cdk-lib';
import RecruitmentNodejsTestStack from '../lib/recruitment-nodejs-test-stack';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new RecruitmentNodejsTestStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(matchTemplate({
    Resources: {},
  }, MatchStyle.EXACT));
});
