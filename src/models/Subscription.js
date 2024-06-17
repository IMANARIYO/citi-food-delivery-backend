import mongoose from "mongoose";
import { weekDay } from "./Weekday.js";
import { DayCategory } from "./dayCategory.js";

const subscriptionSchema = new mongoose.Schema({
  type: { type: String, enum: ['weekly', 'monthly','bi-weekly'], required: false },
  amount: { type: Number, required: false },
dayCategory:{type:String,required:true},
menu: [{
  day: { type: String, required: true },
  foodItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'foodItem', // Assuming 'foodItem' is the name of your FoodItem model
    required: false
  }]
}]
,  monthlyAmount:{
    type: Number,
    required: false
  },

  weeklyAmount:{
    type: Number,
    required: false
  },
  biWeeklyAmount:{
    type: Number,
    required: false
  },
dailyprice:{
    type: Number,
    required: false
},
}, { timestamps: true }).set('strictPopulate', false);


// Pre-save middleware to populate menu based on dayCategory existence
subscriptionSchema.pre('save', async function(next) {
  try {
    const dayCategoryName = this.dayCategory;
    const dayCategory = await DayCategory.findOne({ name: dayCategoryName }).lean(); // Find the dayCategory document

    if (!dayCategory) {
      throw new Error(`Day category "${dayCategoryName}" not found.`);
    }

    // Fetch all DayCategory documents
    const allDayCategories = await DayCategory.find({}).lean();

    // Populate menu field based on dayCategoryName
    this.menu = allDayCategories.map(cat => ({
      day: cat.day,
      foodItems: cat.name === dayCategoryName ? (cat.foodItems || []) : [] // Populate foodItems if dayCategory matches
    }));

    // Create or update weekDay document
    const existingWeekDay = await weekDay.findOne({ day: dayCategory.day });

    if (existingWeekDay) {
      // Update existing weekDay document
      if (!existingWeekDay.dayCategoryNames.includes(dayCategoryName)) {
        existingWeekDay.dayCategoryNames.push(dayCategoryName);
      }
      existingWeekDay.dayCategories = [...new Set([
        ...existingWeekDay.dayCategories.map(id => id.toString()),
        dayCategory._id.toString()
      ])];
      await existingWeekDay.save();
    } else {
      // Create new weekDay document
      const newWeekDay = new weekDay({
        day: dayCategory.day,
        dayCategoryNames: [dayCategoryName],
        dayCategories: [dayCategory._id]
      });
      await newWeekDay.save();
    }

    if (this.type === 'weekly') {
      this.weeklyAmount=this.amount
      this.dailyprice = this.weeklyAmount / 7;
    } else if (this.type === 'bi-weekly') {
      this.biWeeklyAmount=this.amount=
      this.dailyprice = this.biWeeklyAmount / 14;
    } else if (this.type === 'monthly') {
      this.monthlyAmount=this.amount
      this.dailyprice = this.monthlyAmount / 30;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;