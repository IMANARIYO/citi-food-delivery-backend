import mongoose from "mongoose";

const { Schema } = mongoose

const RestourantSchema = new Schema({
  name: { type: String, required: true },

    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },


  address: { type: String, required: true },
  images: [String],
  contactPerson: { type: String, required: true },
  email: { type: String, required: true }
}).set('strictPopulate', false);

const Restourant = mongoose.model('Restourant', RestourantSchema)

export default Restourant
