const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    rating: { type: Number, required: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: "reviews",
  }
);

const review = mongoose.model("Review", schema);

module.exports = review;
