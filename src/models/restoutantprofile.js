import mongoose from "mongoose";

const { Schema } = mongoose;

const restaurantSchema = new Schema({
  name: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  address: { type: String, required: true },
  images: [String],
  contactPerson: { type: String, required: true },
  email: { type: String, required: true }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
