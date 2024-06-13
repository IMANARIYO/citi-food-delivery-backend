import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  foodItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'foodItem',
    required: true
  }],
  totalCost: {
    type: Number,
    default: 0
  }
}, { _id: false });

const daySchema = new mongoose.Schema({
  morning: mealSchema,
  lunch: mealSchema,
  dinner: mealSchema
}, { _id: false });

const weeklyMenuSchema = new mongoose.Schema(
  {
    Sunday: daySchema,
    Monday: daySchema,
    Tuesday: daySchema,
    Wednesday: daySchema,
    Thursday: daySchema,
    Friday: daySchema,
    Saturday: daySchema,
  },
  { timestamps: true }
).set('strictPopulate', false);

// Helper function to calculate total cost for a meal
const calculateMealCost = async (meal, FoodItem) => {
  let total = 0;
  for (const foodItemId of meal.foodItems) {
    const foodItem = await FoodItem.findById(foodItemId);
    if (foodItem) {
      total += foodItem.price;
    }
  }
  return total;
};

// Pre-save hook to calculate total cost for each meal before saving
weeklyMenuSchema.pre('save', async function(next) {
  try {
    const FoodItem = mongoose.model('foodItem');
    for (const day of Object.keys(this.toObject())) {
      if (typeof this[day] === 'object') {
        for (const mealTime of ['morning', 'lunch', 'dinner']) {
          if (this[day][mealTime]) {
            const totalCost = await calculateMealCost(this[day][mealTime], FoodItem);
            this[day][mealTime].totalCost = totalCost;
          }
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

const WeeklyMenu = mongoose.model('WeeklyMenu', weeklyMenuSchema);

export default WeeklyMenu;
