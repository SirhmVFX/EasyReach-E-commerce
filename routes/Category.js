const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middlewares/authentication');
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

router
  .route('/')
  .get(getCategories)
  .post(authenticateUser, authorizePermissions('admin'), createCategory);

router
  .route('/:id')
  .get(getCategory)
  .patch(authenticateUser, authorizePermissions('admin'), updateCategory)
  .delete(authenticateUser, authorizePermissions('admin'), deleteCategory);

module.exports = router;
