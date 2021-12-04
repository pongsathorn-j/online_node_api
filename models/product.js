const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    photo: { type: Array, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
    quantity: { type: Number, required: true, trim: true, default: 0 },
    published: { type: Boolean, default: false },
    createdUserId: { type: Schema.Types.ObjectId, ref: "User" },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    updatedUserId: { type: Schema.Types.ObjectId, ref: "User" },
    discount: { type: Number, default: 0 },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: "products",
  }
);

schema.virtual("reviews", {
  ref: "Review", // Link ไป Model Promotion
  localField: "_id", // _id ฟิลด์ของ Model Product
  foreignField: "productId", //shop ฟิลด์ ของ Model Promotion
});

const product = mongoose.model("Product", schema);

module.exports = product;
