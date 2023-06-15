const Address = require("../models/Address");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const HttpError = require("../HttpException");

const addShippingAddress = async (req, res) => {
    const { addressLine1, addressLine2, city, state, country, postalCode } = req.body;

    if (!addressLine1 || !city || !state || !country || !postalCode) {
        throw new HttpError.BadRequestError('Please provide all address values');
    }

    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
        throw new HttpError.NotFoundError('User not found');
    }

    const address = new Address({
        user: user,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        postalCode
    });

    await address.save();

    res.status(StatusCodes.OK).json({ address });
};

const updateAddress = async (req, res) => {
    const { addressId } = req.params;
    const { addressLine1, addressLine2, city, state, country, postalCode } = req.body;

    const address = await Address.findOne({ _id: addressId, user: req.user.userId });

    if (!address) {
        throw new HttpError.NotFoundError('Address not found');
    }

    address.addressLine1 = addressLine1;
    address.addressLine2 = addressLine2;
    address.city = city;
    address.state = state;
    address.country = country;
    address.postalCode = postalCode;

    await address.save();

    res.status(StatusCodes.OK).json({ address });
};

const getShippingAddress = async (req, res) => {

    const addresses = await Address.find({ user: req.user.userId });

    if (!addresses) {
        throw new HttpError.NotFoundError('Shipping addresses not found');
    }

    res.status(StatusCodes.OK).json({ addresses });
};

const deleteAddress = async (req, res) => {
    const { addressId } = req.params;

    const address = await Address.findOne({ _id: addressId, user: req.user.userId });

    if (!address) {
        throw new HttpError.NotFoundError('Address not found');
    }

    await address.remove();

    res.status(StatusCodes.OK).json({ message: 'Address deleted successfully' });
};

module.exports = {
    addShippingAddress,
    updateAddress,
    getShippingAddress,
    deleteAddress,
}