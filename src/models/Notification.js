import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  deleted:{type:Boolean,
    default:false,
    required:false
  },
  message: { type: String, required: true },
  subscriber: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscriber', required: false }, // e.g., 'user', 'order'
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: false},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  status: { type: String, default: 'unread' }, // e.g., 'unread', 'read'
}, { timestamps: true }).set('strictPopulate', false);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;