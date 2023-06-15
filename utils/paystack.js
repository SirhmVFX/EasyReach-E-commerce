const axios = require('axios');

const paystack = () => {
  const initializePayment = (mycallback) => {
    const options = {
      url: 'https://api.paystack.co/transaction/initialize',
      headers: {
        authorization: process.env.PAYSTACK_SECRET_KEY,
        'content-type': 'application/json',
        'cache-control': 'no-cache',
      },
    };

    axios
      .post(options.url, {}, { headers: options.headers })
      .then((response) => {
        mycallback(null, response.data);
      })
      .catch((error) => {
        mycallback(error, null);
      });
  };

  const verifyPayment = (ref, mycallback) => {
    const options = {
      url: `https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`,
      headers: {
        authorization: process.env.PAYSTACK_SECRET_KEY,
        'content-type': 'application/json',
        'cache-control': 'no-cache',
      },
    };

    axios
      .get(options.url, { headers: options.headers })
      .then((response) => {
        mycallback(null, response.data);
      })
      .catch((error) => {
        mycallback(error, null);
      });
  };

  return { initializePayment, verifyPayment };
};

module.exports = paystack;