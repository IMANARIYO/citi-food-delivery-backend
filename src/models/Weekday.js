import mongoose from "mongoose";

// Schema for the Week Model
const weekDaySchema = new mongoose.Schema({

    day: {
      type: String,unique: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    dayCategoryNames:[ {
       
    }],
    dayCategories:[ {
        type: mongoose.Schema.Types.ObjectId, ref: 'DayCategory', required: false
    }],
    
  }, { timestamps: true }).set('strictPopulate', false);

  
   export const weekDay= mongoose.model('weekDay', weekDaySchema);