const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizePermissions,
} = require('../middlewares/authentication');
const {
    getBanners,
    createBanner,
    getBanner,
    updateBanner,
    deleteBanner,
} = require('../controllers/bannerController');

router
    .route('/')
    .get(getBanners)
    .post(authenticateUser, authorizePermissions('admin'), createBanner);

router
    .route('/:id')
    .get(getBanner)
    .patch(authenticateUser, authorizePermissions('admin'), updateBanner)
    .delete(authenticateUser, authorizePermissions('admin'), deleteBanner);

module.exports = router;
