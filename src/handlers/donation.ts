import AWS from 'aws-sdk';
import { Request, Response } from 'express';
import moment from 'moment';
import { DonationInput, IDonationsItem } from '../interfaces/donations';
import { hasMoreThan2Donations, validateDonationInput } from '../util/donations';
import { sendThankYouEmail } from '../util/email';
import ErrorResponse from '../util/error';

export class DonationHandler {
  donate = async (req: Request, res: Response) => {
    try {
      AWS.config.update({ region: process.env.REGION });
      const documentClient = new AWS.DynamoDB.DocumentClient();
      const { user, amount } = validateDonationInput(req.body as DonationInput);
      const params = {
        TableName: process.env.DONATIONS_TABLE as string,
        Key: { id: user },
        UpdateExpression: 'SET donations = list_append(if_not_exists(donations, :empty_list),:vals)',
        ExpressionAttributeValues: {
          ':vals': [{ amount, createdAt: moment().format() }],
          ':empty_list': [],
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
