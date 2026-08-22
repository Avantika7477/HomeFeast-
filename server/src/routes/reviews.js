const express = require("express");
const Review = require("../models/Review");
const Order = require("../models/Order");
const CookProfile = require("../models/CookProfile");
const { auth, allow } = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, allow("customer"), async (req, res) => {
  const { orderId, rating, comment } = req.body;
  if (!orderId || !rating) {
    return res.status(400).json({ message: "Order and rating are required" });
  }
  const order = await Order.findOne({ _id: orderId, customer: req.user._id });
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.status !== "completed") {
    return res.status(400).json({ message: "You can review only after the order is completed" });
  }
  const existing = await Review.findOne({ order: order._id });
  if (existing) return res.status(409).json({ message: "This order already has a review" });

  const review = await Review.create({
    customer: req.user._id,
    cook: order.cook,
    order: order._id,
    rating,
    comment,
  });

  const stats = await Review.aggregate([
    { $match: { cook: order.cook } },
    { $group: { _id: "$cook", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  if (stats[0]) {
    await CookProfile.findByIdAndUpdate(order.cook, {
      ratingAvg: Math.round(stats[0].avg * 10) / 10,
      ratingCount: stats[0].count,
    });
  }
  return res.status(201).json({ review });
});

module.exports = router;
