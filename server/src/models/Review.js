const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cook: { type: mongoose.Schema.Types.ObjectId, ref: "CookProfile", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
