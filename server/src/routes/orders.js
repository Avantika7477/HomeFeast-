const express = require("express");
const Order = require("../models/Order");
const CookProfile = require("../models/CookProfile");
const MenuItem = require("../models/MenuItem");
const { auth, allow } = require("../middleware/auth");
const { getCookForUser } = require("../utils/cookAccess");

const router = express.Router();

router.post("/", auth, allow("customer"), async (req, res) => {
  const { cookId, items, deliveryAddress, notes } = req.body;
  if (!cookId || !items?.length || !deliveryAddress) {
    return res.status(400).json({ message: "Cook, items, and delivery address are required" });
  }
  const cook = await CookProfile.findOne({ _id: cookId, status: "approved" });
  if (!cook) return res.status(404).json({ message: "Cook is not available" });

  const menuIds = items.map((i) => i.menuItem);
  const menu = await MenuItem.find({ _id: { $in: menuIds }, cook: cook._id, available: true });
  if (menu.length !== items.length) {
    return res.status(400).json({ message: "One or more dishes are unavailable" });
  }
  const priced = items.map((line) => {
    const dish = menu.find((m) => String(m._id) === String(line.menuItem));
    return {
      menuItem: dish._id,
      name: dish.name,
      quantity: line.quantity || 1,
      price: dish.price,
    };
  });
  const totalAmount = priced.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const order = await Order.create({
    customer: req.user._id,
    cook: cook._id,
    items: priced,
    totalAmount,
    deliveryAddress,
    notes,
    paymentMethod: "cash",
  });
  return res.status(201).json({ order });
});

router.get("/mine", auth, allow("customer"), async (req, res) => {
  const orders = await Order.find({ customer: req.user._id })
    .populate("cook", "kitchenName city")
    .sort({ createdAt: -1 });
  return res.json({ orders });
});

router.get("/cook", auth, allow("cook"), async (req, res) => {
  const cook = await getCookForUser(req.user._id);
  if (!cook) return res.status(404).json({ message: "Cook profile not found" });
  const orders = await Order.find({ cook: cook._id })
    .populate("customer", "name phone city")
    .sort({ createdAt: -1 });
  const earnings = orders
    .filter((o) => ["accepted", "completed"].includes(o.status))
    .reduce((sum, o) => sum + o.totalAmount, 0);
  return res.json({ orders, earnings });
});

router.patch("/:id/status", auth, allow("cook", "customer"), async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (req.user.role === "cook") {
    const cook = await getCookForUser(req.user._id);
    if (!cook) return res.status(404).json({ message: "Cook profile not found" });
    if (String(order.cook) !== String(cook._id)) {
      return res.status(403).json({ message: "Not your order" });
    }
    if (!["accepted", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status for cook" });
    }
  } else {
    if (String(order.customer) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your order" });
    }
    if (status !== "cancelled" || order.status !== "pending") {
      return res.status(400).json({ message: "You can only cancel a pending order" });
    }
  }
  order.status = status;
  await order.save();
  return res.json({ order });
});

module.exports = router;
