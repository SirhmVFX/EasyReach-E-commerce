const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const HttpError = require("../HttpException");
const {
    UserTokenPayload,
    createJWT,
} = require("../utils");

const register = async (req, res) => {
    const { email, name, password } = req.body;

    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
        throw new HttpError.BadRequestError("Email already exists");
    }

    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? "admin" : "user";

    const user = await User.create({ name, email, password, role });
    const tokenUser = UserTokenPayload(user);
    const token = createJWT({ payload: tokenUser });
    res.status(StatusCodes.CREATED).json({ user: tokenUser, token: token });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new HttpError.BadRequestError("Please provide email and password");
    }
    const user = await User.findOne({ email });

    if (!user) {
        throw new HttpError.UnauthenticatedError("User doesn't exist");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new HttpError.UnauthenticatedError("Wrong password");
    }
    const tokenUser = UserTokenPayload(user);
    const token = createJWT({ payload: tokenUser });
    res.status(StatusCodes.CREATED).json({ user: tokenUser, token: token });
};

const logout = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "user logged out successfully.!" });
};

module.exports = {
    register,
    login,
    logout,
};