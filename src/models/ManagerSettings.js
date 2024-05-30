import mongoose from "mongoose";

const managerSettingsSchema = new mongoose.Schema({
  weeklyCost: { type: Number, required: true },
  monthlyCost: { type: Number, required: true },
  dailyCost: { type: Number, required: true }
}, { timestamps: true });

const ManagerSettings = mongoose.model('ManagerSettings', managerSettingsSchema);

export default ManagerSettings;
