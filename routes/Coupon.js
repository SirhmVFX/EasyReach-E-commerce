const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizePermissions,
} = require('../middlewares/authentication');
const {
    getCoupons,
    createCoupon,
    getCoupon,
    updateCoupon,
    deleteCoupon,
} = require('../controllers/couponController');

router
    .route('/')
    .get(getCoupons)
    .post(authenticateUser, authorizePermissions('admin'), createCoupon);

router
    .route('/:id')
    .get(getCoupon)
    .patch(authenticateUser, authorizePermissions('admin'), updateCoupon)
    .delete(authenticateUser, authorizePermissions('admin'), deleteCoupon);

module.exports = router;
