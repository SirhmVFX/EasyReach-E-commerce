const Coupon = require("../models/Coupon");
const { StatusCodes } = require("http-status-codes");
const HttpError = require("../HttpException");

const createCoupon = async (req, res, next) => {
    try {
        const { name, code, discount, minAmount, maxAmount } = req.body;

        if (!name || !code || !discount || !minAmount || !maxAmount) {
            throw new HttpError.BadRequestError("Provide all parameters");
        }

        const coupon = new Coupon({
            name,
            code,
            discount,
            minAmount,
            maxAmount,
        });

        const savedCoupon = await coupon.save();

        res.status(StatusCodes.CREATED).json(savedCoupon);
    } catch (error) {
        next(error);
    }
};

const getCoupon = async (req, res, next) => {
    try {
        const couponId = req.params.couponId;
        const coupon = await Coupon.findById(couponId);

        if (!coupon) {
            throw new HttpError.NotFoundError("Coupon not found");
        }

        res.json(coupon);
    } catch (error) {
        next(error);
    }
};

const getCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find({});

        if (coupons.length === 0) {
            res.json({ message: "No coupons found" });
        } else {
            res.json(coupons);
        }
    } catch (error) {
        next(error);
    }
};

const updateCoupon = async (req, res, next) => {
    try {
        const couponId = req.params.couponId;
        const { name, code, discount, minAmount, maxAmount } = req.body;

        if (!name || !code || !discount || !minAmount || !maxAmount) {
            throw new HttpError.BadRequestError("Provide all parameters");
        }

        const updatedCoupon = await Coupon.findByIdAndUpdate(
            couponId,
            {
                name,
                code,
                discount,
                minAmount,
                maxAmount,
            },
            { new: true }
        );

        if (!updatedCoupon) {
            throw new HttpError.NotFoundError("Coupon not found");
        }

        res.json(updatedCoupon);
    } catch (error) {
        next(error);
    }
};

const deleteCoupon = async (req, res, next) => {
    try {
        const couponId = req.params.couponId;
        const deletedCoupon = await Coupon.findByIdAndDelete(couponId);

        if (!deletedCoupon) {
            throw new HttpError.NotFoundError("Coupon not found");
        }

        res.json(deletedCoupon);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCoupon,
    getCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,
};
