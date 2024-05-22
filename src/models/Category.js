import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String,  },
}, { timestamps: true }).set('strictPopulate', false);

const Category = mongoose.model('Category', categorySchema);

export default Category;