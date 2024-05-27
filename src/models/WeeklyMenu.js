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
    }]
  },
  { timestamps: true }
).set('strictPopulate', false);

const WeeklyMenu = mongoose.model('WeeklyMenu', weeklyMenuSchema);

export default WeeklyMenu;
