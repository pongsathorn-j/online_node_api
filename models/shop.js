const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: 'nopic.png' },
    location: {
      lat: { type: Number, trim: true },
      lgn: { type: Number, trim: true },
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: 'shops',
  }
);

schema.virtual('menus', {
  ref: 'Menu', // Link ไป Model Menu
  localField: '_id', // _id ฟิลด์ของ Model Shop
  foreignField: 'shop', //shop ฟิลด์ ของ Model Menu
});

const shop = mongoose.model('Shop', schema);

module.exports = shop;
