const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config(); // Important: Load .env

const connectToDB = require("./db");

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
const infoRouter = require("./router");
app.use("/info", infoRouter);

// Start server only after DB is connected
async function startServer() {
  try {
    await connectToDB();
    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  } catch (err) {
    console.error(" Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
