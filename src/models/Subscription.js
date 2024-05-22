import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  numberOfPeople: { type: Number, required: true },
  email: { type: String, required: true },
  type: { type: String, enum: ['weekly', 'monthly'], required: true },
  amount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, default: 'active' },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  }
}, { timestamps: true }).set('strictPopulate', false);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;