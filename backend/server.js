const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth.routes");
const professorRoutes = require("./routes/professor.routes");
const studentRoutes = require("./routes/student.routes");
const assetRoutes = require("./routes/asset.routes");
const authenticate = require("./middlewares/auth.middleware");
const requireRole = require("./middlewares/role.middleware");
const { seedDefaultAssets } = require("./services/asset.service");

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/professor", authenticate, requireRole("PROFESSOR"), professorRoutes);
app.use("/api/student", authenticate, requireRole("STUDENT"), studentRoutes);

const PORT = 3000;

const startServer = async () => {
  try {
    await seedDefaultAssets();
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to seed media assets:", error.message);
    process.exit(1);
  }
};

startServer();
