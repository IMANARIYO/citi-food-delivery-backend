import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  type: { type: String, enum: ['weekly', 'monthly'], required: false },
  amount: { type: Number, required: false },
  monthlyAmount:{
    type: Number,
    required: false
  },
  weeklyAmount:{
    type: Number,
    required: false
  }, 
dailyprice:{
    type: Number,
    required: false
},
}, { timestamps: true }).set('strictPopulate', false);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;