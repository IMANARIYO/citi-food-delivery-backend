import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
   subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription',required: false },
   phoneNumber: { type: Number, required: false },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'frw' },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: false },
  status: { type: String, default: 'pending' },
}, { timestamps: true }).set('strictPopulate', false);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;