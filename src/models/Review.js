import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    deleted:{type:Boolean,
      default:false,
      required:false
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
