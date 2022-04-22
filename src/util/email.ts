import AWS = require('aws-sdk');
import { String } from 'aws-sdk/clients/appstream';
import { IDonationsItem } from '../interfaces/donations';

const ses = new AWS.SES();

export const validateEmail = (email:string) => !!email.match(
  // eslint-disable-next-line max-len
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
)?.length;

export const sendThankYouEmail = async (donationItem: IDonationsItem) => {
  if (!process.env.FROM_EMAIL || !donationItem) {
    global.logger.error({ message: 'Could not send thank you email as parameters are missing' });
    return;
  }
  const emailParams = {
    Destination: {
      ToAddresses: [donationItem.id],
    },
    Message: {
      Body: {
        Text: {
          Data: `Hello,\n\n We noticed you have made ${donationItem.donations.length} donations to our noble cause. \n\n we'd 
                    like to thank you for your recent donation`,
        },
      },
      Subject: { Data: 'Your donation is helping others' },
    },
    Source: process.env.FROM_EMAIL as String,
  };

  try {
    await ses.sendEmail(emailParams).promise();
  } catch (err:any) {
    global.logger.error({ message: `error sending thank you email. ${err.message}` });
  }
};
