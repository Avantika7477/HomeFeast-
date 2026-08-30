const express = require("express");
const User = require("../models/User");
const CookProfile = require("../models/CookProfile");
const Order = require("../models/Order");
const Subscription = require("../models/Subscription");
const Complaint = require("../models/Complaint");
const { auth, allow } = require("../middleware/auth");
const { notifyUser } = require("../utils/notify");

const router = express.Router();
router.use(auth, allow("admin"));

router.get("/kpis", async (_req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    users,
    cooks,
    pendingCooks,
    totalCookProfiles,
    orders,
    acceptedOrders,
    activeSubscriptions,
    totalSubscriptions,
    openComplaints,
    recentOrderCustomers,
    recentSubCustomers,
    customersWithOrders,
    repeatOrderCustomers,
    customersWithSubs,
    repeatSubCustomers,
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: "admin" } }),
    CookProfile.countDocuments({ status: "approved" }),
    CookProfile.countDocuments({ status: "pending" }),
    CookProfile.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ status: { $in: ["accepted", "completed"] } }),
    Subscription.countDocuments({ status: "active" }),
    Subscription.countDocuments(),
    Complaint.countDocuments({ status: { $ne: "resolved" } }),
    Order.distinct("customer", { createdAt: { $gte: thirtyDaysAgo } }),
    Subscription.distinct("customer", { createdAt: { $gte: thirtyDaysAgo } }),
    Order.distinct("customer"),
    Order.aggregate([
      { $group: { _id: "$customer", count: { $sum: 1 } } },
      { $match: { count: { $gte: 2 } } },
      { $count: "total" },
    ]),
    Subscription.distinct("customer"),
    Subscription.aggregate([
      { $group: { _id: "$customer", count: { $sum: 1 } } },
      { $match: { count: { $gte: 2 } } },
      { $count: "total" },
    ]),
  ]);

  const mauIds = new Set([
    ...recentOrderCustomers.map(String),
    ...recentSubCustomers.map(String),
  ]);

  const engagedCustomers = new Set([
    ...customersWithOrders.map(String),
    ...customersWithSubs.map(String),
  ]);
  const repeatCustomers =
    (repeatOrderCustomers[0]?.total || 0) + (repeatSubCustomers[0]?.total || 0);

  const orderConversionRate = orders ? Math.round((acceptedOrders / orders) * 100) : 0;
  const cookOnboardingRate = totalCookProfiles
    ? Math.round((cooks / totalCookProfiles) * 100)
    : 0;
  const customerRetentionRate = engagedCustomers.size
    ? Math.round((repeatCustomers / engagedCustomers.size) * 100)
    : 0;

  return res.json({
    kpis: {
      users,
      cooks,
      pendingCooks,
      orders,
      activeSubscriptions,
      openComplaints,
      orderConversionRate,
      cookOnboardingRate,
      monthlyActiveUsers: mauIds.size,
      customerRetentionRate,
      totalSubscriptions,
    },
  });
});

router.get("/users", async (_req, res) => {
  const users = await User.find({ role: { $ne: "admin" } })
    .select("-password")
    .sort({ createdAt: -1 });
  return res.json({ users });
});

router.patch("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (req.body.role && ["customer", "cook"].includes(req.body.role)) {
    user.role = req.body.role;
  }
  await user.save();
  return res.json({ user: user.toSafeJSON() });
});

router.delete("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role === "admin") {
    return res.status(400).json({ message: "Cannot remove this account" });
  }
  await CookProfile.deleteOne({ user: user._id });
  await user.deleteOne();
  return res.json({ ok: true });
});

router.get("/cooks", async (_req, res) => {
  const cooks = await CookProfile.find().populate("user", "name email phone city").sort({ createdAt: -1 });
  return res.json({ cooks });
});

router.patch("/cooks/:id/status", async (req, res) => {
  const { status } = req.body;
  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  const cook = await CookProfile.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate(
    "user",
    "name email"
  );
  if (!cook) return res.status(404).json({ message: "Cook not found" });

  if (status === "approved" || status === "rejected") {
    await notifyUser({
      userId: cook.user._id,
      title: status === "approved" ? "Kitchen approved" : "Kitchen not approved",
      message:
        status === "approved"
          ? `${cook.kitchenName} is now visible to customers.`
          : `${cook.kitchenName} was not approved. Contact admin for details.`,
      type: "cook",
      link: status === "approved" ? "/cook" : "/cook/profile",
    });
  }

  return res.json({ cook });
});

router.get("/orders", async (_req, res) => {
  const orders = await Order.find()
    .populate("customer", "name email")
    .populate("cook", "kitchenName city")
    .sort({ createdAt: -1 });
  return res.json({ orders });
});

router.get("/subscriptions", async (_req, res) => {
  const subscriptions = await Subscription.find()
    .populate("customer", "name email")
    .populate("cook", "kitchenName city")
    .sort({ createdAt: -1 });
  return res.json({ subscriptions });
});

module.exports = router;
