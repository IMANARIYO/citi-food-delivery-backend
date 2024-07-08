import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    foodItems: [
      {
        foodItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'foodItem',
          required: true
        },
        quantity: { type: Number, required: true, default: 1 }
      }
    ],
    
  },
  { timestamps: true }
).set('strictPopulate', false);

const Cart = mongoose.model('Cart', cartSchema)

export default Cart
