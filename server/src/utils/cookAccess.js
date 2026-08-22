const CookProfile = require("../models/CookProfile");

async function getCookForUser(userId) {
  return CookProfile.findOne({ user: userId });
}

module.exports = { getCookForUser };
