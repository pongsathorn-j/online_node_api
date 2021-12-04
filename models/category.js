const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    content: { type: String, required: true, trim: true },
    title_th: { type: String, required: true, trim: true },
    content_th: { type: String, required: true, trim: true },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: "category",
  }
);

schema.virtual("products", {
  ref: "Product", // Link ไป Model Product
  localField: "_id", // _id ฟิลด์ของ Model Category
  foreignField: "categoryId", //shop ฟิลด์ ของ Model Product
});

const category = mongoose.model("Category", schema);

module.exports = category;
