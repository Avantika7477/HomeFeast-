const mongoose = require("mongoose");

const cookProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    kitchenName: { type: String, required: true, trim: true },
    bio: { type: String, trim: true, default: "" },
    city: { type: String, required: true, trim: true },
    serviceAreas: [{ type: String, trim: true }],
    cuisines: [{ type: String, trim: true }],
    deliveryStart: { type: String, default: "11:00" },
    deliveryEnd: { type: String, default: "14:00" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    coverImage: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CookProfile", cookProfileSchema);
