const mongoose = require("mongoose");

const CouponSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true,
        },
        discount: {
            type: String,
            required: true
        },
        minAmount: {
            type: Number,
            required: true
        },
        maxAmount: {
            type: Number,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Coupon", CouponSchema);