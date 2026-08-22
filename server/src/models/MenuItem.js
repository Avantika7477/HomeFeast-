const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    cook: { type: mongoose.Schema.Types.ObjectId, ref: "CookProfile", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    mealType: { type: String, enum: ["veg", "non-veg"], required: true },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: "" },
    available: { type: Boolean, default: true },
    category: { type: String, trim: true, default: "Thali" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
