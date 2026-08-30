const Notification = require("../models/Notification");

async function notifyUser({ userId, title, message, type = "system", link = "" }) {
  if (!userId) return null;
  return Notification.create({ user: userId, title, message, type, link });
}

module.exports = { notifyUser };
