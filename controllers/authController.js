const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const HttpError = require("../HttpException");
const { createJWT } = require("../utils");
const generateRandomPassword = require("../utils/password");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");

const register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        const emailAlreadyExists = await User.findOne({ email });
        if (emailAlreadyExists) {
            throw new HttpError.BadRequestError("Email already exists");
        }

        const isFirstAccount = (await User.countDocuments({})) === 0;
        const role = isFirstAccount ? "admin" : "user";

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password: hashPassword,
            role
        });

        const fullName = firstName + " " + lastName;
        const subject = "Welcome To Easyreach";
        const send_to = email;
        const sent_from = "Easyreach <hello@seemetracker.com>";
        const reply_to = "admin@mail.com";
        const template = "welcome";
        const name = fullName;

        try {
            await sendEmail(
                subject,
                send_to,
                sent_from,
                reply_to,
                template,
                name
            );
        } catch (error) {
            console.error("Error sending email:", error);
        }

        const tokenUser = {
            email: user.email,
            userId: user._id,
            role: user.role
        };
        
        const token = createJWT({ payload: tokenUser });

        res.status(StatusCodes.CREATED).json({ user, token });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            throw new HttpError.UnauthenticatedError("User Not Found");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            throw new HttpError.UnauthenticatedError("Wrong password");
        }

        const tokenUser = {
            email: user.email,
            userId: user._id,
            role: user.role
        };

        const token = createJWT({ payload: tokenUser });

        res.status(StatusCodes.OK).json({ user: tokenUser, token: token });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "user logged out successfully.!" });
};

const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            throw new HttpError.NotFoundError("User not found");
        }

        const newPassword = generateRandomPassword(10);

        user.password = newPassword;
        await user.save();

        const fullname = user.firstName + " " + user.lastName;
        const subject = "Reset Password";
        const send_to = email;
        const sent_from = "Easyreach <hello@seemetracker.com>";
        const reply_to = "admin@mail.com";
        const template = "forgetPassword";
        const newpassword = newPassword;
        const name = fullname;

        try {
            await sendEmail(
                subject,
                send_to,
                sent_from,
                reply_to,
                template,
                newpassword,
                name
            );
        } catch (error) {
            console.error("Error sending email:", error);
        }

        res.status(StatusCodes.OK).json({ msg: "New password generated" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    logout,
    forgetPassword,
};
