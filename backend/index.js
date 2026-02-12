import mongoose from "mongoose"; // Mongodb wrapper for Node.js
import express from "express"; // Node.js framework
import cors from "cors"; //

let cleanJson = [];
let summary = {
  inserted: 0,
  skipped: 0,
  duplicates_detected: 0,
};
const app = express();

app.use(express.json());
app.use(cors());

// Db logic
const energyReadingSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price_eur_mwh: Number,
  source: {
    type: String,
    default: "UPLOAD" | "API",
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const EnergyReading = mongoose.model("EnergyReading", energyReadingSchema);

app.get("/api/health", async (req, res) => {
  const health = {
    status: "ok",
    db: "down",
  };
  try {
    mongoose.connect(
      "mongodb://localhost:27017/EnergyReading",
      console.log("Connected to database successfully"),
    );
    health.db = "ok";
    res.json(health);
  } catch (error) {
    res.json(health);
    console.error(error.message);
  }
});

app.post("/api/sync/prices", async (req, res) => {
  console.log(req.body);
  const params = new URLSearchParams({
    start: req.body.start,
    end: req.body.end,
    fields: req.body.fields.map((field) => field),
  }).toString();

  console.log("https://dashboard.elering.ee/api/nps/price?" + params);

  const fetchRes = await fetch(
    "https://dashboard.elering.ee/api/nps/price?" + params,
  );
  res.send(await fetchRes.json());
});

app.post("/api/import/json", async (req, res) => {
  try {
    mongoose.connect(
      "mongodb://localhost:27017/EnergyReading",
      console.log("Connected to database successfully"),
    );
    const data = req.body;

    for (let i = 0; i < data.length - 1; i++) {
      if (isNaN(Date.parse(data[i].timestamp))) {
        summary.skipped++;
        continue;
      }

      if (typeof data[i].price_eur_mwh === String) {
        continue;
      }

      if (!data[i].location) {
        cleanJson.push({
          source: "UPLOAD",
          timestamp: data[i].timestamp,
          location: "EE",
          price_eur_mwh: data[i].price_eur_mwh,
        });
        continue;
      }

      cleanJson.push({
        source: "UPLOAD",
        timestamp: data[i].timestamp,
        location: data[i].location,
        price_eur_mwh: data[i].price_eur_mwh,
      });

      summary.inserted++;
    }
    res.send(summary);
    for (let i = 0; i < cleanJson.length; i++) {
      await EnergyReading.create({
        timestamp: cleanJson[i].timestamp,
        location: cleanJson[i].location,
        price_eur_mwh: cleanJson[i].price_eur_mwh,
        source: cleanJson[i].source,
      });
    }
  } catch (error) {
    console.error(error);
  }
});

app.listen(5000, () => console.log("Server listening on port 5000"));
