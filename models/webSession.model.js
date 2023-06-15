// Dependencies
const mongoose = require("mongoose");

// Stuff
const Schema = mongoose.Schema;

// User Schema
const webSessionSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      // required: true,
    },
    meetingType: {
      type: String,
      required: true,
    },
    tx_ref: {
      type: Number,
      // required: true,
    },
    transactionReference: {
      type: String,
      //   required: true,
      unique: true,
    },
    paymentReference: {
      type: String,
    },
    amount: {
      type: Number,
      // required: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    dateTime: {
      type: String || Date,
      required: true,
    },
    // dateTime: {
    //     type: Date,
    //     required: true,
    // },
    // date: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WebSession", webSessionSchema);
