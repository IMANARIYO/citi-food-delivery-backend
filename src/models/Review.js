import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
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
    },
    rating: { type: Number, required: true },
    comment: { type: String, required: true }
  },
  { timestamps: true }
).set('strictPopulate', false);

const Review = mongoose.model('Review', reviewSchema)

export default Review
