const Jewelry = require('../models/jewelryModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const Booking = require('../models/bookingModel');
const Cart = require('../models/cartModel');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      'Your booking was successful! Check your email for confirmation. If your booking does not show here immediately, please come back later.';

  next();
};

exports.getAllJewelry = catchAsync(async (req, res, next) => {
  const jewelry = await Jewelry.find();

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('jewelry', {
      title: 'All Tours',
      jewelry,
      user: req.user,
    });
});
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('users', {
      title: 'Manage Users',
      users,
      user: req.user,
    });
});
exports.getOverview = catchAsync(async (req, res, next) => {
  const jewelry = await Jewelry.find();
  res.status(200).render('overview', {
    title: 'All Jewelry',
    jewelry,
  });
});

exports.getJewelry = catchAsync(async (req, res, next) => {
  const jewelry = await Jewelry.findOne({ slug: req.params.slug });
  if (!jewelry) {
    res.status(404).render('error', {
      title: 'Error',
    });
  }
  res.status(200).render('jewelryDetails', {
    title: `${jewelry.name} `,
    jewelry,
  });
});

exports.getSignUpForm = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('signup', {
      title: 'Create a new account',
    });
};
exports.getHome = async (req, res) => {
  const random = Math.floor(Math.random() * 7);
  const jewelry = await Jewelry.find().limit(3).skip(random);
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('home', {
      title: 'Home',
      jewelry,
    });
};

exports.getLoginForm = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('login', {
      title: 'Login',
    });
};
exports.getAccount = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('accountInfo', {
      title: 'Your account',
      user: req.user,
    });
};

exports.getMyJewelry = catchAsync(async (req, res, next) => {
  const booking = await Booking.find({ user: req.user.id });
  const paid = await Booking.find({ user: req.user.id, paid: true });
  const jewelryIDs = paid.map((el) => el.jewelry);
  const jewelry = await Jewelry.find({ _id: { $in: jewelryIDs } });

  res.status(200).render('booked', {
    title: 'cart',
    user: req.user,
    jewelry,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});

exports.getForgotPasswordForm = (req, res, next) => {
  res.status(200).render('forgotPassword', {
    title: 'Forgot Password',
  });
};

exports.getPasswordResetForm = (req, res, next) => {
  res.locals.token = req.params.token;
  res.status(200).render('resetPassword', {
    title: 'Reset Your Password',
  });
};

exports.search = catchAsync(async (req, res, next) => {
  const Ma = req.query.term;
  const Ty = req.query.term;
  console.log(Ma);
  console.log(Ty);
  let searchMa = Ma.toLowerCase();
  let searchTy = Ty.toLowerCase();
  let jewelry;
  searchMaterial = await Jewelry.find({ material: searchMa });
  searchType = await Jewelry.find({ typeOf: searchTy });
  if (searchMaterial.length == 0 && searchType.length == 0) {
    res.status(404).render('error', {
      title: 'Error',
    });
  }
  if (searchMaterial.length > 0) {
    jewelry = searchMaterial;
    res.status(200).render('overview', {
      title: 'Gold Jewelry',
      jewelry,
    });
  }
  if (searchType.length > 0) {
    jewelry = searchType;
    res.status(200).render('overview', {
      title: 'Gold Jewelry',
      jewelry,
    });
  }
});

exports.getAddProductForm = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('addProduct', {
      title: 'Create a new product',
    });
};

exports.addProduct = catchAsync(async (req, res, next) => {
  const m = req.body.material;
  const t = req.body.typeOf;
  const material = m.toLowerCase();
  const type = t.toLowerCase();
  const product = await Jewelry.create({
    name: req.body.name,
    material: material,
    typeOf: type,
    price: req.body.price,
    imageCover: req.body.imageCover,
    description: req.body.description,
    weight: req.body.weight,
  });
  res.redirect('/all-jewelry');
});

exports.viewAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Booking.find();
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('allOrders', {
      title: 'View All Orders',
      orders,
      user: req.user,
    });
});

exports.getGold = catchAsync(async (req, res, next) => {
  const jewelry = await Jewelry.find({ material: 'gold' });
  res.status(200).render('overview', {
    title: 'Gold Jewelry',
    jewelry,
  });
});
exports.getDiamond = catchAsync(async (req, res, next) => {
  const jewelry = await Jewelry.find({ material: 'diamond' });
  res.status(200).render('overview', {
    title: 'Diamond Jewelry',
    jewelry,
  });
});
exports.getSilver = catchAsync(async (req, res, next) => {
  const jewelry = await Jewelry.find({ material: 'silver' });
  res.status(200).render('overview', {
    title: 'Silver Jewelry',
    jewelry,
  });
});
exports.getNecklaces = catchAsync(async (req, res, next) => {
  const jewelry = await Jewelry.find({ typeOf: 'necklace' });
  res.status(200).render('overview', {
    title: 'Necklaces',
    jewelry,
  });
});
exports.getEarrings = catchAsync(async (req, res, next) => {
  const jewelry = await Jewelry.find({ typeOf: 'earrings' });
  res.status(200).render('overview', {
    title: 'Earrings',
    jewelry,
  });
});
exports.getBangles = catchAsync(async (req, res, next) => {
  const jewelry = await Jewelry.find({ typeOf: 'bangles' });
  res.status(200).render('overview', {
    title: 'Bangles',
    jewelry,
  });
});
exports.getPendants = catchAsync(async (req, res, next) => {
  const jewelry = await Jewelry.find({ typeOf: 'pendant' });
  res.status(200).render('overview', {
    title: 'Pendants',
    jewelry,
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.find({ user: req.user.id });
  const jewelryIDs = cart.map((el) => el.jewelry);
  const jewelry = await Jewelry.find({ _id: { $in: jewelryIDs } });
  res.status(200).render('cart', {
    title: 'cart',
    user: req.user,
    jewelry,
  });
});
