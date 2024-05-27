import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    }],
    price: { type: Number, required: true },
    description: { type: String, required: true },
    availableDays: [{ type: String, required: true }],
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    }],
    rating: { type: Number },
    time: { type: Number, required: true }
  },
  { timestamps: true }
).set('strictPopulate', false);

// Method to calculate the average rating based on associated reviews
foodItemSchema.methods.calculateRating = async function() {
  const reviews = await mongoose.model('Review').find({ foodItem: this._id });
  let totalRating = 0;
  reviews.forEach(review => {
    totalRating += review.rating;
  });
  if (reviews.length > 0) {
    this.rating = totalRating / reviews.length;
  } else {
    this.rating = 0;
  }
};

const foodItem = mongoose.model('foodItem', foodItemSchema);

export default foodItem;
