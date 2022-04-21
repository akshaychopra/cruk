interface IDonation {
  amount: number,
  donatedAt: Date,
}

export interface IDonationsItem {
  /** email of the person who donated */
  id: string;
  /** list of donations */
  donations: IDonation[];
}

export interface DonationInput {
  amount: number;
  user: string;
}
