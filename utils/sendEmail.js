const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const sendEmail = async (
    subject,
    send_to,
    sent_from,
    reply_to,
    template,
    newpassword,
    name,
    year,
    emailContent,
) => {
    const currentYear = new Date().getFullYear();
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const handlebarOptions = {
        viewEngine: {
            extName: ".handlebars",
            partialsDir: path.resolve("./email"),
            defaultLayout: false,
        },
        viewPath: path.resolve("./email"),
        extName: ".handlebars",
    };

    transporter.use("compile", hbs(handlebarOptions));


    const options = {
        from: sent_from,
        to: send_to,
        replyTo: reply_to,
        subject: subject,

        template,
        context: {
            name,
            newpassword,
            year: currentYear,
            emailContent,
        },
    };


    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });
};

module.exports = sendEmail;