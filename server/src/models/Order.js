const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
    name: String,
    quantity: { type: Number, default: 1, min: 1 },
    price: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cook: { type: mongoose.Schema.Types.ObjectId, ref: "CookProfile", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    deliveryAddress: { type: String, required: true },
    notes: { type: String, default: "" },
    paymentMethod: { type: String, default: "cash" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
