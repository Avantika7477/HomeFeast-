const express = require("express");
const Subscription = require("../models/Subscription");
const CookProfile = require("../models/CookProfile");
const MealPlan = require("../models/MealPlan");
const { auth, allow } = require("../middleware/auth");
const { getCookForUser } = require("../utils/cookAccess");

const router = express.Router();

function endFromStart(start, planType) {
  const end = new Date(start);
  if (planType === "daily") end.setDate(end.getDate() + 1);
  else if (planType === "weekly") end.setDate(end.getDate() + 7);
  else end.setMonth(end.getMonth() + 1);
  return end;
}

router.post("/", auth, allow("customer"), async (req, res) => {
  const { cookId, planType, deliveryAddress, notes, startDate } = req.body;
  if (!cookId || !planType || !deliveryAddress) {
    return res.status(400).json({ message: "Cook, plan type, and address are required" });
  }
  const cook = await CookProfile.findOne({ _id: cookId, status: "approved" });
  if (!cook) return res.status(404).json({ message: "Cook is not available" });
  const plan = await MealPlan.findOne({ cook: cook._id, type: planType });
  if (!plan) return res.status(400).json({ message: "This cook does not offer that meal plan" });

  const start = startDate ? new Date(startDate) : new Date();
  const subscription = await Subscription.create({
    customer: req.user._id,
    cook: cook._id,
    planType,
    price: plan.price,
    startDate: start,
    endDate: endFromStart(start, planType),
    deliveryAddress,
    notes,
  });
  return res.status(201).json({ subscription });
});

router.get("/mine", auth, allow("customer"), async (req, res) => {
  const subscriptions = await Subscription.find({ customer: req.user._id })
    .populate("cook", "kitchenName city")
    .sort({ createdAt: -1 });
  return res.json({ subscriptions });
});

router.get("/cook", auth, allow("cook"), async (req, res) => {
  const cook = await getCookForUser(req.user._id);
  if (!cook) return res.status(404).json({ message: "Cook profile not found" });
  const subscriptions = await Subscription.find({ cook: cook._id })
    .populate("customer", "name phone city")
    .sort({ createdAt: -1 });
  const earnings = subscriptions
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + s.price, 0);
  return res.json({ subscriptions, earnings });
});

router.patch("/:id/status", auth, allow("cook", "customer"), async (req, res) => {
  const { status } = req.body;
  const sub = await Subscription.findById(req.params.id);
  if (!sub) return res.status(404).json({ message: "Subscription not found" });

  if (req.user.role === "cook") {
    const cook = await getCookForUser(req.user._id);
    if (!cook) return res.status(404).json({ message: "Cook profile not found" });
    if (String(sub.cook) !== String(cook._id)) {
      return res.status(403).json({ message: "Not your subscription" });
    }
    if (!["active", "rejected", "paused"].includes(status)) {
      return res.status(400).json({ message: "Invalid status for cook" });
    }
  } else {
    if (String(sub.customer) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your subscription" });
    }
    if (status !== "cancelled") {
      return res.status(400).json({ message: "Customers can only cancel" });
    }
  }
  sub.status = status;
  await sub.save();
  return res.json({ subscription: sub });
});

module.exports = router;
