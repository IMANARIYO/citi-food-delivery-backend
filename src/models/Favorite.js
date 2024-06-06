import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'foodItem',
      required: true
    }
  },
  { timestamps: true }
).set('strictPopulate', false);

const Favorite = mongoose.model('Favorite', favoriteSchema)

export default Favorite;