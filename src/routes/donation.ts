import { DonationHandler } from '../handlers/donation';

const express = require('express');

const router = express.Router();
const donationHandler = new DonationHandler();

router.post('/donate', donationHandler.donate);

export default router;
