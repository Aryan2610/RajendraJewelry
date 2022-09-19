const stripe = require('stripe')(process.env.STRIPE_SECRETKEY);
const Jewelry = require('./../models/jewelryModel');
const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  const price = req.params.price;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/get-cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.userId,
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Amount',
          },
          unit_amount: price * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  });
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.addBooking = catchAsync(async (req, res, next) => {
  const { jewelry, user, price } = req.query;

  if (!jewelry || !user || !price) return next();
  await Booking.create({ jewelry, user, price });

  res.redirect('/get-cart');
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = catchAsync(async (req, res, next) => {
  await Booking.updateMany(
    { user: req.params.userId },
    { paid: true },
    { new: true }
  );
  res.redirect('/get-cart');
});

exports.deleteBooking = catchAsync(async (req, res, next) => {
  await Booking.findOneAndDelete({ jewelry: req.params.id });
  res.redirect('/get-cart');
});
