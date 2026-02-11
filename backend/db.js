import mongoose from "mongoose";
const { Schema, model } = mongoose;

mongoose.connect(
  "mongodb://localhost:27017/EnergyReading",
  console.log("Connected to database successfully"),
);

const energyReadingSchema = new Schema({
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

const EnergyReading = model("EnergyReading", energyReadingSchema);
export default EnergyReading;
