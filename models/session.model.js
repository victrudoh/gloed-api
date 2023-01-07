// Dependencies
const mongoose = require("mongoose");

// Stuff
const Schema = mongoose.Schema;

// User Schema
const sessionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
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
    amount: {
        type: Number,
        // required: true,
    },
    paid: {
        type: Boolean,
        default: false,
    },
    dateTime: {
        type: Date,
        required: true,
    },
    // date: {
    //   type: Date,
    //   default: Date.now,
    // },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Session", sessionSchema);