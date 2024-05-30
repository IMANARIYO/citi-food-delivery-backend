import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  numberOfPeople: { type: Number, required: false },
  email: { type: String, required: false },
  type: { type: String, enum: ['weekly', 'monthly'], required: false },
  amount: { type: Number, required: false },
  monthlyAmount: {
    type: Number,
    required: false
  },
  weeklyAmount: {
    type: Number,
    required: false
  },
  dailyprice: {
    type: Number,
    required: false
  },
  phonenumber: {
    type: Number,
    required: false
  },
  startDate: { type: Date, default: Date.now, required: false },
  endDate: { type: Date, required: false },
  status: { type: String, default: "pending", required: false },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
  totalAmount: { type: Number, required: false },
  remianingbalance: { type: Number, required: false },
}, { timestamps: true }).set('strictPopulate', false);

const Subscriber = mongoose.model('Subscriber', SubscriberSchema);

export default Subscriber;