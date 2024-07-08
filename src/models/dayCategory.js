import mongoose from "mongoose";
import { weekDay } from "./Weekday.js";

// Schema for the CategoryOfSubscription Model
const dayCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    deleted:{type:Boolean,
      default:false,
      required:false
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
      const dayCategoryIds = [doc._id];
  
      // Check if the weekDay already exists
      let existingWeek = await weekDay.findOne({ day });
  
      
      if (existingWeek) {
        // Update existing weekDay document
        if (!existingWeek.dayCategoryNames.includes(doc.name)) {
          existingWeek.dayCategoryNames.push(doc.name);
          if (!existingWeek.dayCategories.includes(doc._id)) {
          existingWeek.dayCategories.push(doc._id);
        }}

       
        
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
