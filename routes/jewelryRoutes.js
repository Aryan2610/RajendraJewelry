const express = require('express');
const jewelryController = require('./../controllers/jewelryController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(jewelryController.getAllJewelry)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    jewelryController.createJewelry
  );

router
  .route('/:id')
  .get(jewelryController.getJewelry)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    jewelryController.uploadJewelryImages,
    jewelryController.resizeJewelryImages,
    jewelryController.updateJewelry
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    jewelryController.deleteJewelry
  );

module.exports = router;
