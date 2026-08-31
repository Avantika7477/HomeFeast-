const mongoose = require("mongoose");

function mongoHelp(uri) {
  const local = uri.includes("127.0.0.1") || uri.includes("localhost");
  if (!local) {
    return "Check MONGO_URI in server/.env and your Atlas IP whitelist.";
  }
  return [
    "MongoDB is not running on this PC.",
    "Fix: open PowerShell as Administrator and run: net start MongoDB",
    "Or use Services (services.msc) → MongoDB Server → Start.",
    "Alternative: use a MongoDB Atlas URI in server/.env",
  ].join("\n");
}

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set in server/.env");
  }
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    if (err.name === "MongooseServerSelectionError") {
      console.error("\n[HomeFeast] Database connection failed.\n");
      console.error(mongoHelp(uri));
      console.error(`\nDetails: ${err.message}\n`);
    }
    throw err;
  }
}

module.exports = { connectDB };
