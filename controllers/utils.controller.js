// Dependencies

// Models
const User = require("../models/user.model");
const Session = require("../models/session.model");

module.exports = {
  //   Test API connection
  getPingController: (req, res) => {
    try {
      return res.status(200).send({
        success: true,
        message: "Pong",
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  },

  // Book a session
  getBookSessionController: async (req, res) => {
    try {
      const { userId } = req.query;

      const { course, type, dateTime } = req.body;

      // const sessionConflict = await Session.findOne({
      //   userId: userId,
      //   dateTime: dateTime,
      // });

      // if (sessionConflict) {
      //   return res.status(400).send({
      //     success: false,
      //     message: "You already have a session at that time",
      //   });
      // }

      const newSession = new Session({
        userId,
        course,
        type,
        dateTime: new Date(dateTime),
      });
      await newSession.save();

      return res.status(200).send({
        success: true,
        message: "created new sesssion successfully",
        data: newSession,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Couldn't create session",
        errMessage: err.message,
      });
    }
  },
};
