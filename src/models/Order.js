import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    email: { type: String, required: true },
    items: [
      {
        foodItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'foodItem',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'pending' }
  },
  { timestamps: true }
).set('strictPopulate', false);

const Order = mongoose.model('Order', orderSchema)

export default Order
