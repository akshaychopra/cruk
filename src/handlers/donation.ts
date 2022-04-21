import * as AWS from 'aws-sdk';
import { Request, Response } from 'express';
import * as moment from 'moment';
import { DonationInput, IDonationsItem } from '../interfaces/donations';
import { hasMoreThan2Donations, validateDonationInput } from '../util/donations';
import { sendThankYouEmail } from '../util/email';
import ErrorResponse from '../util/error';

export class DonationHandler {
  donate = async (req: Request, res: Response) => {
    try {
      const documentClient = new AWS.DynamoDB.DocumentClient();
      const { user, amount } = validateDonationInput(req.body as DonationInput);
      const params = {
        TableName: 'DonationsTable',
        Key: { id: user },
        Item: {
          UpdateExpression: 'SET donations = list_append(donations, :donation)',
          ExpressionAttributeValues: { ':donation': [{ amount, donatedAt: moment().format() }] },
          ReturnValues: 'ALL_NEW',
        },
      };
      const donationItem = (await documentClient.update(params).promise()).Attributes as IDonationsItem;
      if (hasMoreThan2Donations(donationItem)) {
        await sendThankYouEmail(donationItem);
      }
      return res.json(donationItem);
    } catch (err) {
      return ErrorResponse(err, res);
    }
  };
}
