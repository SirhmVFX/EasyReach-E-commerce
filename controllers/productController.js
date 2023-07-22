const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const HttpError = require('../HttpException');

const createProduct = async (req, res, next) => {
    try {
        const {
            name,
            price,
            quantity,
            colors,
            category,
            miniDescription,
            description,
        } = req.body;

        const productImages = [];

        if (req.files && req.files.images) {
            for (const image of req.files.images) {
                const result = await cloudinary.uploader.upload(image.path, {
                    folder: 'easy',
                });

                productImages.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        }

        const product = new Product({
            name,
            price,
            quantity,
            colors,
            images: productImages,
            category,
            miniDescription,
            description,
        });

        const savedProduct = await product.save();

        res.status(StatusCodes.CREATED).json(savedProduct);
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const {
            name,
            price,
            quantity,
            colors,
            category,
            miniDescription,
            description,
        } = req.body;

        const productImages = [];

        if (req.files && req.files.images) {
            for (const image of req.files.images) {
                const result = await cloudinary.uploader.upload(image.path, {
                    folder: 'easy',
                });

                productImages.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name,
                price,
                quantity,
                colors,
                images: productImages,
                category,
                miniDescription,
                description,
            },
            { new: true }
        );

        if (!updatedProduct) {
            throw new HttpError.NotFoundError('Product not found');
        }

        res.json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({});

        if (products.length === 0) {
            res.json({ message: 'No products found' });
        } else {
            res.json(products);
        }
    } catch (error) {
        next(error);
    }
};

const getProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            throw new HttpError.NotFoundError('Product not found');
        }

        res.json(product);
    } catch (error) {
        next(error);
    }
};

const searchProducts = async (req, res, next) => {
    try {
        const { keyword } = req.query;

        if (!keyword || keyword.trim() === '') {
            throw new HttpError.BadRequestError('Keyword is required for search');
        }

        const products = await Product.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ],
        });

        if (products.length === 0) {
            return res.json({ message: 'No products found matching the search criteria' });
        }

        res.json(products);
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            throw new HttpError.NotFoundError('Product not found');
        }

        if (deletedProduct.images && deletedProduct.images.length > 0) {
            for (const image of deletedProduct.images) {
                await cloudinary.uploader.destroy(image.public_id);
            }
        }

        res.json(deletedProduct);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProduct,
    updateProduct,
    getProducts,
    getProduct,
    searchProducts,
    deleteProduct,
};
