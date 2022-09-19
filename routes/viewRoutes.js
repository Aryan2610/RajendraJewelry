const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
const jewelryController = require('../controllers/jewelryController');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.use(viewsController.alerts);

router.get('/', authController.isLoggedIn, viewsController.getHome);
router.get(
  '/all-products',
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get('/gold', authController.isLoggedIn, viewsController.getGold);
router.get('/diamond', authController.isLoggedIn, viewsController.getDiamond);
router.get('/silver', authController.isLoggedIn, viewsController.getSilver);
router.get(
  '/necklaces',
  authController.isLoggedIn,
  viewsController.getNecklaces
);
router.get('/earrings', authController.isLoggedIn, viewsController.getEarrings);
router.get('/bangles', authController.isLoggedIn, viewsController.getBangles);
router.get('/pendants', authController.isLoggedIn, viewsController.getPendants);
router.get(
  '/get-overview/:slug',
  authController.isLoggedIn,
  viewsController.getJewelry
);

router.get('/search', viewsController.search);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-orders', authController.protect, viewsController.getMyJewelry);
router.get('/signup', authController.isLoggedIn, viewsController.getSignUpForm);
router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);
router.post(
  '/submit-product-data',
  authController.protect,
  authController.restrictTo('admin'),
  jewelryController.uploadJewelryImages,
  jewelryController.resizeJewelryImages,
  viewsController.addProduct
);
router.get(
  '/add-jewelry',
  authController.isLoggedIn,
  viewsController.getAddProductForm
);
router.get(
  '/all-orders',
  authController.isLoggedIn,
  viewsController.viewAllOrders
);
router.get(
  '/manage-users',
  authController.isLoggedIn,
  viewsController.getAllUsers
);
router.get(
  '/all-jewelry',
  authController.isLoggedIn,
  viewsController.getAllJewelry
);
router.get('/forgot-password', viewsController.getForgotPasswordForm);
router.get('/password-reset/:token', viewsController.getPasswordResetForm);
router.get('/get-cart', authController.isLoggedIn, viewsController.getCart);
router.get('/add-cart', authController.isLoggedIn, cartController.addCart);
router.get(
  '/add-booking',
  authController.isLoggedIn,
  bookingController.addBooking
);
router.get(
  '/delete-cart/:id',
  authController.isLoggedIn,
  cartController.deleteCart
);
router.get('/delete-cart', authController.isLoggedIn, cartController.deleteAll);
router.get(
  '/delete-booking/:id',
  authController.isLoggedIn,
  bookingController.deleteBooking
);
router.get(
  '/update-bookings/:userId',
  authController.isLoggedIn,
  bookingController.updateBooking
);
module.exports = router;
