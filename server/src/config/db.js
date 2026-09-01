const mongoose = require("mongoose");
const dns = require("dns");

// Helps on some Windows networks where SRV lookups fail
dns.setDefaultResultOrder("ipv4first");

const connectOptions = {
  serverSelectionTimeoutMS: 15000,
  family: 4,
};

function mongoHelp(uri, err) {
  if (err?.message?.includes("querySrv ECONNREFUSED")) {
    return [
      "DNS cannot resolve mongodb+srv on this network.",
      "Fix: use a standard mongodb:// URI with directConnection=true in server/.env.",
      "Atlas → Connect → Drivers → copy the standard string, or use a single shard host.",
      "Or set Windows DNS to 8.8.8.8 and 8.8.4.4, then retry.",
    ].join("\n");
  }
  if (err?.message?.includes("Server selection timed out")) {
    return [
      "Could not reach MongoDB Atlas (replica set / firewall).",
      "Fix: use directConnection=true with one shard host in MONGO_URI.",
      "Example host: ac-pbexo93-shard-00-00.nujg9kg.mongodb.net:27017",
      "Also check Atlas IP whitelist and that port 27017 is not blocked.",
    ].join("\n");
  }
  const local = uri.includes("127.0.0.1") || uri.includes("localhost");
  if (!local) {
    return "Check MONGO_URI in server/.env, Atlas IP whitelist, and database user password.";
  }
  return [
    "MongoDB is not running on this PC.",
    "Fix: Services → MongoDB Server → Start, or use Atlas MONGO_URI.",
  ].join("\n");
}

async function connectDB() {
  // Prefer standard URI (avoids SRV DNS issues on Windows)
  const uri = process.env.MONGO_URI_STANDARD || process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set in server/.env");
  }
  if (uri.startsWith("mongodb+srv://") && !process.env.MONGO_URI_STANDARD) {
    console.warn(
      "[HomeFeast] Tip: mongodb+srv can fail on some networks. Set MONGO_URI_STANDARD in .env if needed."
    );
  }
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri, connectOptions);
    console.log(`MongoDB connected (${mongoose.connection.db.databaseName})`);
  } catch (err) {
    console.error("\n[HomeFeast] Database connection failed.\n");
    console.error(mongoHelp(uri, err));
    console.error(`\nDetails: ${err.message}\n`);
    throw err;
  }
}

module.exports = { connectDB };
