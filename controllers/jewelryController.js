const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const Jewelry = require('./../models/jewelryModel');
const APIFeatures = require('../utils/apifeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Jewelry.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const jewelry = await features.query;
  res.status(200).json({
    status: 'success',
    results: jewelry.length,
    data: {
      jewelry,
    },
  });
});
exports.getAllJewelry = factory.getAll(Jewelry);
exports.getJewelry = factory.getOne(Jewelry);
exports.createJewelry = factory.createOne(Jewelry);
exports.updateJewelry = factory.updateOne(Jewelry);
exports.deleteJewelry = factory.deleteOne(Jewelry);

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadJewelryImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'image', maxCount: 3 },
]);

// upload.single('image');
// upload.array('images', 5);

exports.resizeJewelryImages = catchAsync(async (req, res, next) => {
  req.body.imageCover = `jewelry-${req.params.id}-${Date.now()}-cover.jpeg`;
  if (!req.files.imageCover) return next();
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg()
    .toFile(`public/img/jewels/${req.body.imageCover}`);
  next();
});
