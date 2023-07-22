const User = require("../models/User");
const Wishlist = require("../models/Wishlist");
const { StatusCodes } = require("http-status-codes");
const HttpError = require("../HttpException");

const addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            throw new HttpError(StatusCodes.NOT_FOUND, "User not found");
        }

        const existingWishlistItem = await Wishlist.findOne({ user: userId, product: productId });
        if (existingWishlistItem) {
            throw new HttpError(StatusCodes.BAD_REQUEST, "Product already exists in wishlist");
        }

        const newWishlistItem = new Wishlist({
            user: userId,
            product: productId,
        });
        await newWishlistItem.save();

        return res.status(StatusCodes.CREATED).json(newWishlistItem);
    } catch (error) {
        next(error);
    }
};

const removeFromWishlist = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const { userId } = req.params;


        const user = await User.findById(userId);
        if (!user) {
            throw new HttpError(StatusCodes.NOT_FOUND, "User not found");
        }


        const existingWishlistItem = await Wishlist.findOne({ user: userId, product: productId });
        if (!existingWishlistItem) {
            throw new HttpError(StatusCodes.NOT_FOUND, "Product not found in wishlist");
        }

        await existingWishlistItem.remove();

        return res.status(StatusCodes.NO_CONTENT).json({});
    } catch (error) {
        next(error);
    }
};

const getWishlist = async (req, res, next) => {
    try {
        const { userId } = req.params;


        const user = await User.findById(userId);
        if (!user) {
            throw new HttpError(StatusCodes.NOT_FOUND, "User not found");
        }

        const wishlistItems = await Wishlist.find({ user: userId }).populate("product");

        return res.status(StatusCodes.OK).json(wishlistItems);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
};
