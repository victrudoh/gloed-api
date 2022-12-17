const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

const sendMail = (mailOptions) => {

    transporter.sendMail({
            from: `"GLOED" ${process.env.MAIL_USER}`,
            to: mailOptions.to,
            subject: mailOptions.subject || "No Subject",
            html: mailOptions.html,
        },
        function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        }
    );
};

module.exports = sendMail;