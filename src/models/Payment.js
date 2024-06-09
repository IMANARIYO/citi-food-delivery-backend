import mongoose from "mongoose";

// Sub-schema for individual payments within a group
const individualPaymentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  amount: { type: Number, required: true }
}, { _id: false });

// Main schema for payment
const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
   subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription',required: false },
   phoneNumber: { type: Number, required: false },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'frw' },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: false },
  groupPayments: {
    type: [individualPaymentSchema],
    required: true
  } 
  , // Array of individual payments for group payments, and it's required
  status: { type: String, default: 'pending' },
}, { timestamps: true }).set('strictPopulate', false);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;