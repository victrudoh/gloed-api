// Dependencies

// Models
const User = require("../models/user.model");
const Session = require("../models/session.model");

// middlewares
const tx_ref = require("../middlewares/tx_ref");

// Services
const FLW_services = require("../services/flutterwave.services");
const sendMail = require("../services/mailer.services");

// templates
const adminPaidSessionMail = require("../templates/adminPaidSessionMail.templates");
const userPaidSessionMail = require("../templates/userPaidSessionMail.templates");

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
            console.log("postBookSessionController:async ~ userId", userId);

            // find user
            const user = await User.findById({ _id: userId });
            if (!user) return res.status(400).send("User not found");

            const { amount, course, type, comment, meetingType, dateTime } = req.body;

            const currency = "NGN";
            const newAmount = parseInt(req.body.amount);
            const transREf = tx_ref.get_Tx_Ref();

            const payload = {
                tx_ref: transREf,
                amount: newAmount,
                currency: currency,
                payment_options: "card",
                redirect_url: "https://topapp.ng/utility/verify",
                customer: {
                    email: user.email,
                    phonenumber: user.phone,
                    name: `${user.firstName} ${user.lastName}`,
                },
                meta: {
                    customer_id: userId,
                },
                customizations: {
                    title: "Gloed",
                    description: "Pay with card",
                    logo: "#",
                },
            };

            const newSession = new Session({
                userId,
                course,
                type,
                amount,
                comment,
                meetingType,
                tx_ref: transREf,
                dateTime: new Date(dateTime),
            });
            await newSession.save();

            const response = await FLW_services.initiateTransaction(payload);

            return res.status(200).send({
                success: true,
                message: "created new sesssion successfully",
                data: {
                    session: newSession,
                    url: response,
                },
            });
        } catch (err) {
            console.log(
                "🚀 ~ file: utils.controller.js:87 ~ postBookSessionController:async ~ err",
                err
            );
            return res.status(500).send({
                success: false,
                message: "Couldn't create session",
                errMessage: err.message,
            });
        }
    },

    // // Book a session
    // postBookSessionController: async(req, res) => {
    //     try {
    //         const { userId } = req.query;

    //         const { course, type, comment, meetingType, dateTime } = req.body;

    //         // const sessionConflict = await Session.findOne({
    //         //   userId: userId,
    //         //   dateTime: dateTime,
    //         // });

    //         // if (sessionConflict) {
    //         //   return res.status(400).send({
    //         //     success: false,
    //         //     message: "You already have a session at that time",
    //         //   });
    //         // }

    //         const newSession = new Session({
    //             userId,
    //             course,
    //             type,
    //             comment,
    //             meetingType,
    //             dateTime: new Date(dateTime),
    //         });
    //         await newSession.save();

    //         return res.status(200).send({
    //             success: true,
    //             message: "created new sesssion successfully",
    //             data: newSession,
    //         });
    //     } catch (err) {
    //         return res.status(500).send({
    //             success: false,
    //             message: "Couldn't create session",
    //             errMessage: err.message,
    //         });
    //     }
    // },

    // Verify payment
    getVerifyController: async(req, res, next) => {
        try {
            const id = req.query.transaction_id;
            const tx_ref = req.query.tx_ref;

            const verify = await FLW_services.verifyTransaction(id);
            console.log("getVerifyController:async ~ verify", verify);

            if (verify.status === "successful") {
                const session = await Session.findOne({ tx_ref: tx_ref });
                console.log("session: ", session);

                if (session) {
                    session.paid = true;
                    await session.save();

                    // Find all admins
                    const admins = await User.find({ role: "admin" });

                    // find user
                    const user = await User.findById({ _id: session.userId });
                    if (!user) return res.status(400).send("User not found");

                    //   send mail to all admins
                    if (admins) {
                        admins.map((admin) => {
                            // Send password to admin's email
                            const mailOptions = {
                                to: admin.email,
                                subject: "New Session Mail",
                                html: adminPaidSessionMail(
                                    user.firstName,
                                    session.course,
                                    session.dateTime,
                                    admin.firstName
                                ),
                            };
                            sendMail(mailOptions);
                        });
                    }

                    // Send password to user's email
                    const mailOptions = {
                        to: user.email,
                        subject: "New Session Mail",
                        html: adminPaidSessionMail(
                            user.firstName,
                            session.course,
                            session.dateTime
                        ),
                    };
                    sendMail(mailOptions);

                    //   const mailOptions = {
                    //     to: user.email,
                    //     subject: "Payment confirmation",
                    //     html: `Hello, You have successfully registered for your session, head to your dashboard to see your course schedule<br/> Thank you for choosing Gloed.`,
                    //   };

                    // await sendMail(mailOptions);

                    return res.status(200).send({
                        success: true,
                        data: {
                            session,
                        },
                        message: "transaction successful",
                    });
                } else {
                    res.status(400).send({
                        success: false,
                        message: makePayment.data.response_description,
                    });
                }
            } else {
                res.status(500).send({
                    success: false,
                    message: "Payment was not successful",
                });
            }
        } catch (err) {
            console.log("EERROOOORR: ", err);
            res.status(500).send({
                success: false,
                message: "Oops! Something is wrong",
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

            // find user
            const user = await User.findById({ _id: userId });
            if (!user) return res.status(400).send("User not found");

            const sessions = await Session.find({
                userId: userId,
                dateTime: { $gte: formatDate },
            });

            return res.status(200).send({
                success: true,
                length: sessions.length,
                message: `Fetched schedule successfully for ${user.firstName}`,
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