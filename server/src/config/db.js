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
  if (err?.message?.includes("Server selection timed out") || err?.message?.includes("not primary")) {
    return [
      "Could not reach a writable MongoDB Atlas primary.",
      "Fix: set MONGO_URI to a directConnection host (shard-00-00/01/02), or use SRV on Render.",
      "Also check Atlas IP whitelist (0.0.0.0/0 for demo) and that port 27017 is not blocked.",
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

function shardCandidates(uri) {
  const match = uri.match(/@(ac-[^.]+-shard-00-)(\d{2})\.([^/?]+)/i);
  if (!match || !uri.includes("directConnection=true")) return [uri];
  const [, prefix, , hostSuffix] = match;
  return ["00", "01", "02"].map((n) =>
    uri.replace(/@(ac-[^.]+-shard-00-)\d{2}\.([^/?]+)/i, `@${prefix}${n}.${hostSuffix}`)
  );
}

async function connectToWritable(uri) {
  const candidates = shardCandidates(uri);
  let lastErr;
  for (const candidate of candidates) {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      await mongoose.connect(candidate, connectOptions);
      const hello = await mongoose.connection.db.admin().command({ hello: 1 });
      const writable = Boolean(hello.isWritablePrimary || hello.ismaster);
      if (!writable) {
        lastErr = new Error("not primary");
        await mongoose.disconnect();
        continue;
      }
      return candidate;
    } catch (err) {
      lastErr = err;
      try {
        if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
      } catch {
        // ignore
      }
    }
  }
  throw lastErr || new Error("Could not connect to a writable MongoDB primary");
}

async function connectDB() {
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
    const used = await connectToWritable(uri);
    const host = (used.match(/@([^/?]+)/) || [])[1] || "unknown";
    console.log(`MongoDB connected (${mongoose.connection.db.databaseName}) via ${host}`);
  } catch (err) {
    console.error("\n[HomeFeast] Database connection failed.\n");
    console.error(mongoHelp(uri, err));
    console.error(`\nDetails: ${err.message}\n`);
    throw err;
  }
}

module.exports = { connectDB };
