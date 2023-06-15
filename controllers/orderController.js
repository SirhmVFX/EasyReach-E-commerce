const Order = require('../models/Order');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const HttpError = require('../HttpException');
const { authorizeUser } = require('../utils');

const createOrder = async (req, res) => {
    const { items: cartItems, tax, shippingFee } = req.body;
    if (!cartItems || cartItems.length < 1) {
        throw new HttpError.BadRequestError('No cart items provided');
    }
    if (!tax || !shippingFee) {
        throw new HttpError.BadRequestError(
            'Please provide tax and shipping fee'
        );
    }

    let orderItems = [];
    let subtotal = 0;

    for (const item of cartItems) {
        const dbProduct = await Product.findOne({ _id: item.product });
        if (!dbProduct) {
            throw new HttpError.NotFoundError(
                `No product with id : ${item.product}`
            );
        }
        const { name, price, image, _id } = dbProduct;
        const singleOrderItem = {
            count: item.count,
            name,
            price,
            color: item.color,
            image,
            product: _id,
        };

        orderItems = [...orderItems, singleOrderItem];

        subtotal += item.amount * price;

    }

    const total = tax + shippingFee + subtotal;

    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        user: req.user.userId,
    });

    res
        .status(StatusCodes.CREATED)
        .json({ order });
};

const getAllOrders = async (req, res) => {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
        throw new HttpError.NotFoundError(`No order with id : ${orderId}`);
    }
    authorizeUser(req.user, order.user);
    res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user.userId });
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const updateOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const { paymentIntentId } = req.body;

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
        throw new HttpError.NotFoundError(`No order with id : ${orderId}`);
    }
    authorizeUser(req.user, order.user);

    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();

    res.status(StatusCodes.OK).json({ order });
};

module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder,
};