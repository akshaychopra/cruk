import { DonationInput, IDonationsItem } from '../interfaces/donations';
import { validateEmail } from './email';
import { BadRequestError } from './error';

export const hasMoreThan2Donations = (donationItem: IDonationsItem) => donationItem?.donations.length >= 2;

export const validateDonationInput = (donationInput: DonationInput) => {
  if (!donationInput.amount || !donationInput.user) {
    throw new BadRequestError({
      silent: true,
      status: 400,
      message: 'Missing parameters',
    });
  }
  if (!validateEmail(donationInput.user)) {
    throw new BadRequestError({
      silent: true,
      status: 400,
      message: 'Invalid email.',
    });
  }
  if (donationInput.amount < 1) {
    throw new BadRequestError({
      silent: true,
      status: 400,
      message: 'Donation amount cannot be less than 1',
    });
  }
  return donationInput;
};
