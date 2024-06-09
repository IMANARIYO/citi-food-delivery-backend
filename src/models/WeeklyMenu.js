import mongoose from "mongoose";

const weeklyMenuSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true
    },
    foodItems: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'foodItem',
      required: true
    }],
    totalCost: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
).set('strictPopulate', false);

// Pre-save hook to calculate total cost before saving
weeklyMenuSchema.pre('save', async function(next) {
  try {
    let total = 0;
    const FoodItem = mongoose.model('foodItem');
    for (const foodItemId of this.foodItems) {
      const foodItem = await FoodItem.findById(foodItemId);
      if (foodItem) {
        total += foodItem.price;
      }
    }
    this.totalCost = total;
    next();
  } catch (error) {
    next(error);
  }
});

const WeeklyMenu = mongoose.model('WeeklyMenu', weeklyMenuSchema);

export default WeeklyMenu;
