import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String,  },
}, { timestamps: true }).set('strictPopulate', false);
// Static method for search functionality
categorySchema.statics.search = async function(searchParams) {
  const query = {};

  if (searchParams.keyword) {
    const keyword = searchParams.keyword;
    query.name = { $regex: keyword, $options: 'i' }; // case-insensitive search
  }

  return await this.find(query);
};

const Category = mongoose.model('Category', categorySchema);

export default Category;