import mongoose from "mongoose"; // Mongodb wrapper for Node.js
import express from "express"; // Node.js framework
import cors from "cors"; //
import EnergyReading from "./db.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) => {
  try {
    mongoose.connect("mongodb://localhost:2717/EnergyReading");
    res.json({
      status: "ok",
      db: "ok",
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.listen(5000, () => console.log("Server listening on port 5000"));
