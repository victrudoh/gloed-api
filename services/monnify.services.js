const axios = require("axios");
const asyncHandler = require("../middlewares/asyncHandler");

// var monnify = new Monnify(
//   process.env.MONNIFY_SECRET_KEY,
//   process.env.MONNIFY_API_KEY,
//   process.env.MONNIFY_BASE_URL
// );

var key = Buffer.from(
  process.env.MONNIFY_API_KEY + ":" + process.env.MONNIFY_SECRET_KEY
).toString("base64");

const options = {
  timeout: 1000 * 60,
  headers: {
    "content-type": "application/json",
    Authorization: `Basic ${key}`,
  },
};

exports.obtainAccessToken = asyncHandler(async (payload) => {
  const response = await axios.post(
    `${process.env.MONNIFY_BASE_URL}/api/v1/auth/login`,
    payload,
    options
  );
  return response.data.responseBody.accessToken;
});

exports.getBanks = asyncHandler(async (accessToken) => {
  console.log("🚀 Fetching banks");
  const response = await axios.get(
    `${process.env.MONNIFY_BASE_URL}/api/v1/banks`,
    {
      timeout: 1000 * 60,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data.responseBody;
});

exports.initializePayment = asyncHandler(async (details, accessToken) => {
  console.log(
    "🚀 ~ file: monnify.services.js:45 ~ exports.initializePayment=asyncHandler ~ details:",
    details
  );
  let requestBody = {
    amount: details.amount,
    customerName: details.name,
    customerEmail: details.email,
    // paymentReference: new String(new Date().getTime()),
    // paymentReference: "1239230423134023",
    paymentReference: details.tx_ref,
    paymentDescription: details.description,
    currencyCode: "NGN",
    contractCode: process.env.MONNIFY_CONTRACT_CODE,
    paymentMethods: [
      process.env.MONNIFY_CARD_PAYMENT_METHOD,
      process.env.MONNIFY_ACCOUNT_TRANSFER_PAYMENT_METHOD,
    ],
    redirectUrl: process.env.MONNIFY_REDIRECT_URL,
  };

  try {
    const response = await axios.post(
      `${process.env.MONNIFY_BASE_URL}/api/v1/merchant/transactions/init-transaction`,
      requestBody,
      {
        // timeout: 1000 * 60,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(
      "🚀 ~ file: monnify.services.js:84 ~ exports.initializePayment=asyncHandler ~ response:",
      response
    );
    return response.data.responseBody;
  } catch (error) {
    console.log(
      "🚀 ~ file: monnify.services.js:77 ~ exports.initializePayment=asyncHandler ~ error:",
      error
    );
    return error;
  }
});

exports.verifyPayment = async (transactionReference, accessToken) => {
  try {
    const response = await axios.get(
      `${process.env.MONNIFY_BASE_URL}/api/v2/transactions/${transactionReference}`,
      {
        timeout: 1000 * 60,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(
      "🚀 ~ file: monnify.services.js:98 ~ exports.verifyPayment= ~ response:",
      response
    );
    return response.data.responseBody;
  } catch (error) {
    console.log(
      "🚀 ~ file: monnify.services.js:95 ~ exports.verifyPayment= ~ error:",
      error.response.data
    );
    return error.response.data;
  }
};

exports.withdraw = async (details, accessToken) => {
  let requestBody = {
    amount: details.amount,
    reference: new String(new Date().getTime()),
    narration: "Withdraw from Usepays Wallet",
    destinationBankCode: details.destinationBankCode,
    destinationAccountNumber: details.destinationAccountNumber,
    currency: "NGN",
    sourceAccountNumber: process.env.MONNIFY_WALLET_ACCOUNT_NUMBER,
    destinationAccountName: details.destinationAccountName,
  };
  console.log(
    "🚀 ~ file: monnify.services.js:128 ~ exports.withdraw= ~ requestBody:",
    requestBody
  );
  try {
    const response = await axios.post(
      `${process.env.MONNIFY_BASE_URL}/api/v2/disbursements/single`,
      requestBody,
      {
        // timeout: 1000 * 60,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(
      "🚀 ~ file: monnify.services.js:138 ~ exports.withdraw= ~ response:",
      response.data
    );
    return response.data.responseBody;
  } catch (error) {
    console.log(
      "🚀 ~ file: monnify.services.js:146 ~ exports.withdraw= ~ error:",
      error
    );
  }
};

exports.validateBankAccount = asyncHandler(
  async (accountNumber, bankCode, accessToken) => {
    const response = await axios.get(
      `${process.env.MONNIFY_BASE_URL}/api/v1/disbursements/account/validate?accountNumber=${accountNumber}&bankCode=${bankCode}`,
      {
        timeout: 1000 * 60,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.responseBody;
  }
);
