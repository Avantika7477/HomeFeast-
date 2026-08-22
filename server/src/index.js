require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");

const authRoutes = require("./routes/auth");
const cookRoutes = require("./routes/cooks");
const menuRoutes = require("./routes/menus");
const orderRoutes = require("./routes/orders");
const subscriptionRoutes = require("./routes/subscriptions");
const reviewRoutes = require("./routes/reviews");
const categoryRoutes = require("./routes/categories");
const complaintRoutes = require("./routes/complaints");
const adminRoutes = require("./routes/admin");

const app = express();
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: clientUrl.split(",").map((s) => s.trim()),
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "homefeast-api", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/cooks", cookRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `No route for ${req.method} ${req.path}` });
});

app.use((err, _req, res, _next) => {
  if (err.code === 11000) {
    return res.status(409).json({ message: "That record already exists" });
  }
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`HomeFeast API listening on ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
  });
