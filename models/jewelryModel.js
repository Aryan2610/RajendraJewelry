const mongoose = require('mongoose');
const slugify = require('slugify');

const jewelrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A jewelry must have a name'],
    },
    slug: String,
    material: {
      type: String,
      required: [true, 'A jewelry must have a material'],
    },
    typeOf: {
      type: String,
      required: [true, 'A jewelry must be a of a type'],
    },
    price: {
      type: Number,
      required: [true, 'A jewelry must have a price'],
    },
    weight: {
      type: String,
    },
    description: {
      type: String,
    },
    imageCover: {
      type: String,
      required: [true, 'A jewelry must have a cover image'],
    },
    images: [String],
    favorite: Boolean,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// jewelrySchema.index({ slug: 1 });
jewelrySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Jewelry = mongoose.model('Jewelry', jewelrySchema);

module.exports = Jewelry;
