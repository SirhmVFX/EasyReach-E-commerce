const mongoose = require('mongoose');

const SingleOrderItemSChema = mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
    },
});

const OrderSchema = mongoose.Schema(
    {
        tax: {
            type: Number,
            required: true,
        },
        shippingFee: {
            type: Number,
            required: true,
        },
        deliveryFee: {
            type: Number,
            required: true,
        },
        subtotal: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        isDelivered: {
            type: Boolean,
            default: false,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        orderItems: [SingleOrderItemSChema],
        status: {
            type: String,
            enum: ['pending', 'failing', 'success', 'delivered', 'cancelled'],
            default: 'pending',
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);