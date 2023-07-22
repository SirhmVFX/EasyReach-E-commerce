const Banner = require("../models/Banner");
const { StatusCodes } = require("http-status-codes");
const HttpError = require("../HttpException");
const cloudinary = require("../config/cloudinary")

const createBanner = async (req, res, next) => {
    try {
        const { name, description, image } = req.body;

        if (!name || !description) {
            throw new HttpError.BadRequestError("Provide name and description");
        }

        let bannerImage;

        if (image) {
            const result = await cloudinary.uploader.upload(image, {
                folder: "easy",
            });

            bannerImage = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        }

        const banner = new Banner({
            name,
            description,
            image: bannerImage,
        });

        const savedBanner = await banner.save();

        res.status(StatusCodes.CREATED).json(savedBanner);
    } catch (error) {
        next(error);
    }
};

const getBanner = async (req, res, next) => {
    try {
        const bannerId = req.params.bannerId;
        const banner = await Banner.findById(bannerId);

        if (!banner) {
            throw new HttpError.NotFoundError("Banner not found");
        }

        res.json(banner);
    } catch (error) {
        next(error);
    }
};

const getBanners = async (req, res, next) => {
    try {
        const banners = await Banner.find({});

        if (banners.length === 0) {
            res.json({ message: "No banners found" });
        } else {
            res.json(banners);
        }
    } catch (error) {
        next(error);
    }
};

const updateBanner = async (req, res, next) => {
    try {
        const bannerId = req.params.bannerId;
        const { name, description } = req.body;

        if (!name || !description) {
            throw new HttpError.BadRequestError("Provide name and description");
        }

        const updatedBanner = await Banner.findByIdAndUpdate(
            bannerId,
            {
                name,
                description,
            },
            { new: true }
        );

        if (!updatedBanner) {
            throw new HttpError.NotFoundError("Banner not found");
        }

        res.json(updatedBanner);
    } catch (error) {
        next(error);
    }
};

const deleteBanner = async (req, res, next) => {
    try {
        const bannerId = req.params.bannerId;
        const deletedBanner = await Banner.findByIdAndDelete(bannerId);

        if (!deletedBanner) {
            throw new HttpError.NotFoundError("Banner not found");
        }

        res.json(deletedBanner);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBanner,
    getBanner,
    getBanners,
    updateBanner,
    deleteBanner,
};
