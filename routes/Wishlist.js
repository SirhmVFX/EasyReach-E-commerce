const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/authentication');

const {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
} = require('../controllers/wishlistController');

router.route('/:userId')
    .post(authenticateUser, addToWishlist)
    .delete(authenticateUser, removeFromWishlist)
    .get(authenticateUser, getWishlist);

module.exports = router;
