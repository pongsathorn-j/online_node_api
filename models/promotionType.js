const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    remark: { type: String, trim: true },
    status: { type: Boolean, required: true, default: false },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: "promotion_type",
  }
);

schema.virtual("promotions", {
  ref: "Promotion", // Link ไป Model Promotion
  localField: "_id", // _id ฟิลด์ของ Model PromotionType
  foreignField: "promotionTypeId", //shop ฟิลด์ ของ Model Promotion
});

const promotionType = mongoose.model("PromotionType", schema);

module.exports = promotionType;
