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
    postBookSessionController: async(req, res) => {
        try {
            const { userId } = req.query;

            const { course, type, comment, meetingType, dateTime } = req.body;

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
                comment,
                meetingType,
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

    //   GEt all upcoming sessions
    getScheduleController: async(req, res) => {
        try {
            const today = Date.now();
            const formatDate = new Date(today);
            console.log(
                "🚀 ~ file: utils.controller.js ~ line 69 ~ getScheduleController: ~ formatDate",
                formatDate
            );

            const { userId } = req.query;
            const sessions = await Session.find({
                userId: userId,
                dateTime: { $gte: formatDate },
            });

            return res.status(200).send({
                success: true,
                length: sessions.length,
                message: "Fetched schedule successfully",
                sessions: sessions,
            });
        } catch (err) {
            return res.status(500).send({
                success: false,
                message: err.message,
            });
        }
    },
};