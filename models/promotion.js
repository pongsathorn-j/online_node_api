const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    content: { type: String, trim: true },
    promotionTypeId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "PromotionType",
    },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: "promotions",
  }
);

const promotion = mongoose.model("Promotion", schema);

module.exports = promotion;
