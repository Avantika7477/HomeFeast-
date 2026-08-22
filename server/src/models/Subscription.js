const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cook: { type: mongoose.Schema.Types.ObjectId, ref: "CookProfile", required: true },
    planType: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
    price: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "active", "rejected", "paused", "cancelled"],
      default: "pending",
    },
    deliveryAddress: { type: String, required: true },
    notes: { type: String, default: "" },
    paymentMethod: { type: String, default: "cash" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
