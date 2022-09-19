const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  jewelry: {
    type: mongoose.Schema.ObjectId,
    ref: 'Jewelry',
    required: [true, 'Booking must belong to a Jewelry!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!'],
  },
  price: {
    type: Number,
    require: [true, 'Booking must have a price.'],
  },
  paid: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

cartSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'jewelry',
    select: 'name',
  });
  next();
});
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
