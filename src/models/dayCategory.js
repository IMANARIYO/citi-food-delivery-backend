import mongoose from "mongoose";
import { weekDay } from "./Weekday.js";

// Schema for the CategoryOfSubscription Model
const dayCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    foodItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foodItem',
        required: false
      }
    ],
    day: {
      type: String,
      enum: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      required: true
    }
  },
  { timestamps: true }
).set('strictPopulate', false);

// Define middleware to trigger weekDay creation or update when a DayCategory is saved or updated
dayCategorySchema.post('save', async function(doc) {
    try {
      const day = doc.day;
      const dayCategoryNames = [doc.name];
      const dayCategoryIds =  [doc._id.toString()];
  
      // Check if the weekDay already exists
      let existingWeek = await weekDay.findOne({ day });
  
      if (existingWeek) {
        // Update existing weekDay document
        let updated = false;
  
        existingWeek.dayCategoryNames.forEach((name, index) => {
          if (name === doc.name) {
            existingWeek.dayCategoryNames[index] = doc.name;
            updated = true;
          }
        });
  
        if (!updated) {
          existingWeek.dayCategoryNames.push(doc.name);
        }
  
        existingWeek.dayCategories = [...new Set([
          ...existingWeek.dayCategories.map(id => id.toString()),
          ...dayCategoryIds
        ])];
        
        await existingWeek.save();
      } else {
        // Create a new weekDay document
        const newWeekDay = new weekDay({
          day,
          dayCategoryNames,
          dayCategories: dayCategoryIds
        });
  
        await newWeekDay.save();
      }
    } catch (error) {
      console.error('Error in dayCategory post save middleware:', error);
    }
  });
  
export const DayCategory = mongoose.model('DayCategory', dayCategorySchema)
