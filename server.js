const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./middleware/auth");
const connectDB = require("./config/database");
const User = require("./models/User");
const Contract = require("./models/Contract");

// Load environment variables
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Connect to database
connectDB();

// Initialize default admin user
const initializeAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: "admin" });
    if (!adminExists) {
      await User.create({
        username: "admin",
        password: "admin123", // Will be hashed by pre-save hook
        role: "admin",
      });
      console.log("Default admin user created");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

// Initialize admin after DB connection
setTimeout(initializeAdmin, 1000);

// Login endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const user = await User.findOne({ username, isActive: true });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Protected route to get current user info
app.get("/api/auth/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.post("/api/contracts", async (req, res) => {
  try {
    console.log("Received contract data:", req.body);

    const {
      fullName,
      phoneNumber,
      position,
      businessName,
      signature,
      agreed,
      plan,
      startDate,
    } = req.body;

    // Detailed validation (signature is optional)
    const missingFields = [];
    if (!fullName) missingFields.push("fullName");
    if (!phoneNumber) missingFields.push("phoneNumber");
    if (!position) missingFields.push("position");
    if (!businessName) missingFields.push("businessName");
    if (!agreed) missingFields.push("agreed");
    if (!plan) missingFields.push("plan");
    if (!startDate) missingFields.push("startDate");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missingFields: missingFields,
      });
    }

    const contractData = {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      position: position.trim(),
      businessName: businessName.trim(),
      agreed,
      plan: plan.trim(),
      startDate: startDate.trim(),
      status: "pending",
    };

    // Only add signature if it exists
    if (signature) {
      contractData.signature = signature;
    }

    const newContract = await Contract.create(contractData);

    console.log(
      `[${new Date().toISOString()}] Contract signed by ${fullName} (${businessName})`,
    );
    res.status(201).json({
      message: "သဘောတူညီမှု တင်ပို့ပြီးပါပြီ။",
      id: newContract._id,
      contract: newContract,
    });
  } catch (error) {
    console.error("Error saving contract:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);

    // Send detailed error response
    res.status(500).json({
      error: "Server error",
      details: error.message,
      name: error.name,
    });
  }
});

app.get("/api/contracts", authenticateToken, async (req, res) => {
  try {
    const contracts = await Contract.find().sort({ createdAt: -1 });
    res.json(contracts);
  } catch (error) {
    console.error("Error fetching contracts:", error);
    res.status(500).json({ error: "Failed to read contracts" });
  }
});

app.get("/api/contracts/:id", authenticateToken, async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
    }
    res.json(contract);
  } catch (error) {
    console.error("Error fetching contract:", error);
    res.status(500).json({ error: "Failed to read contract" });
  }
});

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(
      `OTAS Tech Solutions - Contract Server running on http://localhost:${PORT}`,
    );
  });
}

// Export for Vercel
module.exports = app;
