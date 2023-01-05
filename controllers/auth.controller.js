// Dependencies
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const User = require("../models/user.model");

// services
const sendMail = require("../services/mailer.services");

// templates
const newUserMail = require("../templates/newUserMail.templates");

// Middlewares
const {
    signUpValidation,
    loginValidation,
} = require("../middlewares/validate");

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

    //   SignUp
    postRegisterController: async(req, res, next) => {
        try {
            // const { firstName, lastName, username, email, phone, password, media } =
            //   req.body;
            // const { fullname, email, password } = req.body;
            const { firstName, lastName, email, phone, password } = req.body;

            // const body = { ...req.body, media: req.file };

            // Run Hapi/Joi validation
            const { error } = await signUpValidation.validateAsync(req.body);
            if (error) return res.status(400).send(error.details[0].message);

            //   check if email exist
            const emailExists = await User.findOne({ email: email });
            if (emailExists) {
                return res.status(400).send({
                    success: false,
                    message: "Email exists",
                });
            }

            //   Hash password
            const hashedPassword = await bcrypt.hash(password, 12);

            // create user
            const user = new User({
                firstName,
                lastName,
                email,
                phone,
                password: hashedPassword,
            });
            await user.save();

            // Find all admin
            const admins = await User.find({ role: "admin" });

            if (admins) {
                admins.map((admin) => {
                    // Send password to admin's email
                    const mailOptions = {
                        to: admin.email,
                        subject: "New Registration Mail",
                        html: newUserMail(user.fullname, user._id, admin.fullname),
                    };

                    sendMail(mailOptions);
                });
            }

            // Send password to admin's email
            // const mailOptions = {
            //     to: user.email,
            //     subject: "New Registration Mail",
            //     html: newUserMail(user.fullname, user._id, user.email),
            // };

            // sendMail(mailOptions);

            return res.status(200).send({
                success: true,
                data: {
                    user: user,
                },
                message: "User Registered successfully",
            });
        } catch (err) {
            return res.status(500).send({
                success: false,
                errMessage: err.message,
                message: "Couldn't register user",
            });
        }
    },

    // Login
    postLoginController: async(req, res, next) => {
        try {
            const { email, password } = req.body;

            // Run Hapi/Joi validation
            const { error } = await loginValidation.validateAsync(req.body);
            if (error) return res.status(400).send(error.details[0].message);

            //   check if user exist
            const user = await User.findOne({ email: email });
            if (!user) return res.status(400).send("Invalid email or password");

            // validate password
            const validatePassword = await bcrypt.compare(password, user.password);
            if (!validatePassword)
                return res.status(400).send("Invalid email or password");

            //   Generate JWT Token
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

            // console.log("postLoginController:async ~ token", token);
            // console.log("postLoginController:async ~ user", user);

            return res.status(200).send({
                success: true,
                data: {
                    user: user,
                    token: token,
                },
                message: "Login successful",
            });
        } catch (err) {
            console.log(
                "🚀 ~ file: auth.controller.js:143 ~ postLoginController:async ~ err",
                err
            );
            return res.status(500).send({
                success: false,
                errMessage: err.message,
                message: "Couldn't log in",
            });
        }
    },
};