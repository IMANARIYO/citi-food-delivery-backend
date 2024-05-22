import Category from "../models/Category.js";
import Favorite from "../models/Favorite.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { AppError, catchAsync } from "../middlewares/globaleerorshandling.js";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Helper function to check and add categories
const checkAndAddCategories = async (categories) => {
  console.log(categories);


  console.log(typeof(categories));

   const uniqueCategories = new Set();
   let categoryIds = [];
   categoryIds=categories;
   for(let i=0; i<categoryIds.length; i++){
     console.log('categoryId', categoryIds[i]);
    //  const categoryExists = await Category.findById(categoryIds[i]);
    //  if (categoryExists) {
    //    uniqueCategories.add(categoryIds[i].toString());
    //  }
   }
  for (const categoryId of categoryIds) {
    console.log('categoryId', categoryId);
    const categoryExists = await Category.findById(categoryId);
    if (categoryExists) {
      uniqueCategories.add(categoryId.toString());
    }
  }
  return Array.from(uniqueCategories);
};

// Combined create and update function
const createOrUpdateObject = async (req, Model, isUpdate = false) => {
  let newObject = { ...req.body };
  console.log('req.body', req.body);

  // Handle image uploads
  if (req.files && req.files.images) {
    console.log('Images processing');
    let imagesArray = [];
    for (let index = 0; index < req.files.images.length; index++) {
      imagesArray.push(
        (await cloudinary.uploader.upload(req.files.images[index].path)).secure_url
      );
    }
    newObject.images = imagesArray;
    console.log('imagesArray', imagesArray);
  }

  if (req.files && req.files.image) {
    console.log('Images processing', '____________________', process.env.CLOUD_NAME, "---", process.env.API_KEY, "---", process.env.API_SECRET);
    newObject.image = (await cloudinary.uploader.upload(req.files.image[0].path)).secure_url;
  }

  // Check and deduplicate categories
  if (newObject.category && newObject.category.length > 0) {
    newObject.category = newObject.category.split(',');

 
    newObject.category = await checkAndAddCategories(newObject.category);
    // Log the categories array before calling the function




  }

  if (isUpdate) {
    // Update operation
    let documentToUpdate = await Model.findById(req.params.id);
    if (!documentToUpdate) {
      throw new AppError(`${Model.modelName} not found with ID: ${req.params.id}`, 404);
    }
    documentToUpdate.set(newObject);
    return await documentToUpdate.save();
  } else {
    let userId = req.userId ? req.userId : '65e32c1efd954736cf61b722';
    req.body.userId=userId;
    if(Model ==
      Favorite ){
        newObject.userId = userId;
      }

    // Create operation
    return await Model.create(newObject);
  }
};

// Handler functions
const handleModelOperation = (Model, operation) => {
  return catchAsync(async (req, res, next) => {
    try {
      let result;
      switch (operation) {
        case 'create':
          result = await createOrUpdateObject(req, Model);
          res.status(201).json({
            status: 'success',
            message: `${Model.modelName} created successfully`,
            data: result
          });
          break;
        case 'read':
          if (req.params.id) {
            result = await Model.findById(req.params.id)
             .populate('foodItems')
             .populate('foodItem')
             .populate('category')
             .populate('orderId')
             .populate('userId')
             .populate('reviews')
             .populate('subscriptionId');
            res.status(200).json({
              status: 'success',
              message: `${Model.modelName} retrieved successfully`,
              data: result,
            });
          } else {
            result = await Model.find()
             .populate('foodItems')
             .populate('foodItem')
             .populate('category')
             .populate('orderId')
             .populate('userId')
             .populate('reviews')
             .populate('subscriptionId');
            res.status(200).json({
              status: 'success',
              message: `All ${Model.modelName} retrieved successfully`,
              data: result,
            });
          }
          break;
        case 'update':
          result = await createOrUpdateObject(req, Model, true);
          res.status(200).json({
            status: 'success',
            message: `${Model.modelName} updated successfully`,
            data: result,
          });
          break;
        case 'delete':
          let documentToDelete = await Model.findById(req.params.id);
          if (!documentToDelete) {
            throw new AppError(`${Model.modelName} not found with ID: ${req.params.id}`, 404);
          }
          result = await Model.findByIdAndDelete(req.params.id);
          res.status(200).json({
            status: 'success',
            message: `${Model.modelName} deleted successfully`,
            data: result,
          });
          break;
        default:
          throw new AppError('Invalid operation', 400);
      }
    } catch (error) {
      next(error);
    }
  });
};

// Export handler functions
export const createModelHandler = Model => {
  return handleModelOperation(Model, 'create');
};
export const readModelHandler = Model => {
  return handleModelOperation(Model, 'read');
};
export const updateModelHandler = Model => {
  return handleModelOperation(Model, 'update');
};
export const deleteModelHandler = Model => {
  return handleModelOperation(Model, 'delete');
};
