const Category = require("../models/Category");
const { StatusCodes } = require("http-status-codes");
const HttpError = require("../HttpException");

const createCategory = async (req, res) => {
    const { name, description } = req.body;

    if (!description) {
        throw new HttpError.BadRequestError("Description is required");
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
        throw new HttpError.BadRequestError("Category already exists");
    }

    const category = await Category.create({ name, description });

    res
        .status(StatusCodes.CREATED)
        .json({ category });
};

const getCategories = async (req, res) => {
    const categories = await Category.find();
    res.status(StatusCodes.OK).json({ categories });
};

const getCategory = async (req, res) => {
    const category = await Category.findOne({ _id: req.params.id });

    if (!category) {
        throw new HttpError.NotFoundError(`No category with id: ${req.params.id}`);
    }

    res.status(StatusCodes.OK).json({ category });
};

const updateCategory = async (req, res) => {
    const { name, description } = req.body;
    const { id } = req.params;

    if (!name || !description) {
        throw new HttpError.BadRequestError("Please provide all values");
    }

    const category = await Category.findOne({ _id: id });

    if (!category) {
        throw new HttpError.NotFoundError(`No category with id: ${id}`);
    }

    category.name = name;
    category.description = description;

    await category.save();

    res.status(StatusCodes.OK).json({ category });
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    const category = await Category.findOne({ _id: id });

    if (!category) {
        throw new HttpError.NotFoundError(`No category with id: ${id}`);
    }

    await category.remove();

    res.status(StatusCodes.NO_CONTENT).end();
};

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
};