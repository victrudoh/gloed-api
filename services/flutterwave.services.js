const axios = require("axios");
// const dotenv = require("dotenv").config();
require("dotenv").config();

const Flutterwave = require("flutterwave-node-v3");

const baseURL = process.env.FLUTTERWAVE_BASE_URL;
// const FLW_pubKey = process.env.FLUTTERWAVE_PUBLIC_KEY;
// const FLW_secKey = process.env.FLUTTERWAVE_SECRET_KEY;

// TEST Mode
const FLW_pubKey = process.env.FLUTTERWAVE_TEST_PUBLIC_KEY;
const FLW_secKey = process.env.FLUTTERWAVE_TEST_SECRET_KEY;

const flw = new Flutterwave(FLW_pubKey, FLW_secKey);

const options = {
  timeout: 1000 * 60,
  headers: {
    "content-type": "application/json",
    Authorization: `Bearer ${FLW_secKey}`,
  },
};

const initiateTransaction = async (payload) => {
  try {
    const response = await axios.post(`${baseURL}/payments`, payload, options);
    console.log(`Bearer ${FLW_secKey}`);
    return response.data.data.link;
  } catch (err) {
    console.log(err);
  }
};

const verifyTransaction = async (id) => {
  try {
    const response = await axios.get(
      `${baseURL}/transactions/${id}/verify`,
      options
    );
    console.log("verify: ", response.data);
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  initiateTransaction,
  verifyTransaction,
};
