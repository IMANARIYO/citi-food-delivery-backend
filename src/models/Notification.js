import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'unread' }, // e.g., 'unread', 'read'
}, { timestamps: true }).set('strictPopulate', false);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;