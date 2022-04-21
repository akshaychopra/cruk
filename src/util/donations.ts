import { DonationInput, IDonationsItem } from '../interfaces/donations';
import { validateEmail } from './email';
import { BadRequestError } from './error';

export const hasMoreThan2Donations = (donationItem: IDonationsItem) => donationItem?.donations.length >= 2;

export const validateDonationInput = (donationInput: DonationInput) => {
  if (!donationInput.amount || !donationInput.user) {
    throw new BadRequestError('Some parameters are missing');
  }
  if (!validateEmail(donationInput.user)) {
    throw new BadRequestError('Invalid Email');
  }
  if (donationInput.amount < 1) {
    throw new BadRequestError('Invalid Amount');
  }
  return donationInput;
};
