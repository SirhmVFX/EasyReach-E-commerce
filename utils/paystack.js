const axios = require('axios');
const HttpError = require('../HttpException');

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
};

class Paystack {
  constructor() {
    this.data = null;
  }

  initializePayment = async (data) => {
    const url = 'https://api.paystack.co/transaction/initialize';

    try {
      const result = await axios.post(
        url,
        {
          email: data.email,
          amount: data.amount + '00',
          ref: data.reference_id,
        },
        {
          headers: headers,
        }
      );
      this.data = result.data;
    } catch (error) {
      throw new HttpError.BadRequestError("Something went wrong");
    }

    return this.data;
  };

  verifyPayment = async (reference) => {
    try {
      const result = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: headers,
      });
      this.data = result.data;
    } catch (error) {
      throw new HttpError.BadRequestError("Something went wrong");
    }

    return this.data;
  };
}

module.exports = Paystack;
