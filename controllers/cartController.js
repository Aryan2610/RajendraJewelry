const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const Cart = require('../models/cartModel');

exports.addCart = catchAsync(async (req, res, next) => {
  const { jewelry, user, price } = req.query;

  if (!jewelry || !user || !price) return next();
  await Cart.create({ jewelry, user, price });

  res.redirect(`/add-booking?jewelry=${jewelry}&user=${user}&price=${price}`);
});

exports.deleteCart = catchAsync(async (req, res, next) => {
  await Cart.findOneAndDelete({ jewelry: req.params.id });

  res.redirect(`/delete-booking/${req.params.id}`);
});
exports.deleteAll = catchAsync(async (req, res, next) => {
  await Cart.deleteMany();
});
