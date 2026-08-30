const express = require("express");
const Notification = require("../models/Notification");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });
  return res.json({ notifications, unreadCount });
});

router.patch("/read-all", auth, async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  return res.json({ ok: true });
});

router.patch("/:id/read", auth, async (req, res) => {
  const note = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );
  if (!note) return res.status(404).json({ message: "Notification not found" });
  return res.json({ notification: note });
});

module.exports = router;
