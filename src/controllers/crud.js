import Category from "../models/Category.js";
import Favorite from "../models/Favorite.js";
import Notification from "../models/Notification.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Subscriber from "../models/subscribers.js";
import Subscription from "../models/Subscription.js";
import WeeklyMenu from "../models/WeeklyMenu.js";
import dotenv from "dotenv";
import foodItem from "../models/foodItem.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { AppError, catchAsync } from "../middlewares/globaleerorshandling.js";

// import Category from "../models/Category.js";
// import Favorite from "../models/Favorite.js";
// import Order from "../models/Order.js";
// import Payment from "../models/Payment.js";
// import WeeklyMenu from "../models/WeeklyMenu.js";
// import dotenv from "dotenv";
// import foodItem from "../models/foodItem.js";
// import mongoose from "mongoose";
// import { v2 as cloudinary } from "cloudinary";
// import { AppError, catchAsync } from "../middlewares/globaleerorshandling.js";

// dotenv.config();
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

// // Helper function to check and add categories
// const checkAndAddCategories = async (categories) => {
//   console.log(categories);
//   console.log(typeof(categories));
//    const uniqueCategories = new Set();
//    let categoryIds = [];
//    categoryIds=categories;
   
//   for (const categoryId of categoryIds) {
//     console.log('categoryId', categoryId);
//     const categoryExists = await Category.findById(categoryId);
//     if (categoryExists) {
//       uniqueCategories.add(categoryId.toString());
//     }
//   }
//   return Array.from(uniqueCategories);
// };

// // Helper function to check and add food items
// const checkAndAddFoodItems = async (foodItems) => {
//   const validFoodItems = [];
//   for (const foodItemId of foodItems) {
//     const foodItemExists = await foodItem.findById(foodItemId);
//     if (foodItemExists) {
//       validFoodItems.push(foodItemId);
//     } else {
//       throw new AppError(`FoodItem not found with ID: ${foodItemId}`, 404);
//     }
//   }
//   return validFoodItems;
// };
// // Combined create and update function
// const createOrUpdateObject = async (req, Model, isUpdate = false) => {
//   let newObject = { ...req.body };
//   console.log('req.body', req.body);

//   // Handle image uploads
//   if (req.files && req.files.images) {
//     console.log('Images processing');
//     let imagesArray = [];
//     for (let index = 0; index < req.files.images.length; index++) {
//       imagesArray.push(
//         (await cloudinary.uploader.upload(req.files.images[index].path)).secure_url
//       );
//     }
//     newObject.images = imagesArray;
//     console.log('imagesArray', imagesArray);
//   }

//   if (req.files && req.files.image) {
//     // console.log('Images processing', '____________________', process.env.CLOUD_NAME, "---", process.env.API_KEY, "---", process.env.API_SECRET);
//     newObject.image = (await cloudinary.uploader.upload(req.files.image[0].path)).secure_url;
//   }

//   // Check and deduplicate categories
//   if (newObject.category && newObject.category.length > 0) {
//     newObject.category = newObject.category.split(',');
   
 
//     newObject.category = await checkAndAddCategories(newObject.category);


//     if (Model === WeeklyMenu) {
//       // Specific handling for WeeklyMenu
//       const { day, foodItems } = newObject;
  
//       // Check if the day already exists
//       const existingMenu = await WeeklyMenu.findOne({ day });
  
//       if (existingMenu) {
//         // Day already exists, check for duplicates and push new food items
//         for (const item of foodItems) {
//           if (!existingMenu.foodItems.includes(item)) {
//             existingMenu.foodItems.push(item);
//           }
//         }
//         await existingMenu.save();
//         return existingMenu;
//       } else {
//         // Day doesn't exist, create a new menu for the day
//         return await WeeklyMenu.create(newObject);
//       }
//     }

//     // Log the categories array before calling the function
//   }

//   if (isUpdate) {
//     // Update operation
//     let documentToUpdate = await Model.findById(req.params.id);
//     if (!documentToUpdate) {
//       throw new AppError(`${Model.modelName} not found with ID: ${req.params.id}`, 404);
//     }
//     documentToUpdate.set(newObject);
//     return await documentToUpdate.save();
//   } else {
//     let userId = req.userId 
//     const schemaPaths = Model.schema.paths;
//     if (schemaPaths.userId) {
//       newObject.userId = userId;
//     }
  
//     // ? req.userId : '65e32c1efd954736cf61b722';
//     // req.body.userId=userId;

//     if (Model === Payment) {
//       const orderId = req.params.orderId;
//       const amount = req.body.amount;

//       // Check if the order exists
//       const order = await Order.findById(orderId);
//       if (!order) {
//         throw new AppError('Order not found', 404);
//       }

//       // Check if the payment amount is correct
//       if (amount < order.totalPrice) {
//         throw new AppError('Payment amount is less than the order total price', 400);
//       }
//       if (amount > order.totalPrice) {
//         throw new AppError('Payment amount is greater than the order total price', 400);
//       }

//       // Set orderId and amount
//       newObject.orderId = orderId;
//       newObject.amount = amount;

//       // Create payment document
//       const payment = new Payment(newObject);
//       await payment.save();

//       // Update order with payment ID and status
//       order.paymentId = payment._id;
//       order.status = 'paid';
//       await order.save();

//       // Update payment status
//       payment.status = 'completed';
//       await payment.save();

//       // Create a notification
//       const notification = new Notification({
//         message: 'Order paid successfully. Delivery in process.',
//         orderId: order._id,
//         userId: userId,
//         status: 'unread',
//       });
//       await notification.save();

//       return payment;
//     }


//     // Create operation
//     return await Model.create(newObject);
//   }
// };

// // Handler functions
// const handleModelOperation = (Model, operation) => {
//   return catchAsync(async (req, res, next) => {
//     try {
//       let result;
//       switch (operation) {
//         case 'create':
//           result = await createOrUpdateObject(req, Model);
//           res.status(201).json({
//             status: 'success',
//             message: `${Model.modelName} created successfully`,
//             data: result
//           });
//           case 'read':
//             let query;
//             if (req.userId) {
//               if (req.user.role === 'admin') {
//                 query = Model.find();
//               } else {
//                 if (Model === Order || Model === Payment || Model === Notification || Model === Favorite || Model === Cart) {
//                   query = Model.find({ userId: req.userId });
//                 } else {
//                   query = Model.find();
//                 }
//               }
//             } else {
//               query = Model.find();
//             }
          
//             if (req.params.id) {
//               query.populate({
//                 path: 'orderId',
//                 populate: {
//                   path: 'items.foodItem',
//                   model: 'FoodItem'
//                 }
//               }).populate('foodItems')
//                    .populate('foodItem')
//                    .populate('category')
//                    .populate('orderId')
//                    .populate('userId')
//                    .populate('items.foodItem')
//                    .populate('paymentId')
//                    .populate('reviews')
//                    .populate('subscriptionId')
// .populate("items")
//                    .populate('paymentId')
//                    .populate('reviews')
//                    .populate('category')
//                    .populate('subscriptionId');
//               try {
//                 const result = await query.findById(req.params.id).exec();
//                 if (!result) {
//                   return res.status(404).json({
//                     status: 'error',
//                     message: `${Model.modelName} not found with ID: ${req.params.id}`,
//                   });
//                 }
//                 return res.status(200).json({
//                   status: 'success',
//                   message: `${Model.modelName} retrieved successfully`,
//                   data: result,
//                 });
//               } catch (error) {
//                 return res.status(500).json({
//                   status: 'error',
//                   message: 'Internal Server Error',
//                 });
//               }
//             } else {
//               query.populate('foodItems')
//                    .populate('foodItem')
//                    .populate('category')
//                    .populate('orderId')
//                    .populate('userId')
//                    .populate('paymentId')
//                    .populate('reviews')
//                    .populate('subscriptionId')
// .populate("items")
//                    .populate('items.foodItem')
//                    .populate('paymentId')
//                    .populate('reviews')
                  
//               try {
//                 const result = await query.exec();
//                 return res.status(200).json({
//                   status: 'success',
//                   message: `All ${Model.modelName} retrieved successfully`,
//                   data: result,
//                 });
//               } catch (error) {
//                 return res.status(500).json({
//                   status: 'error',
//                   message: 'Internal Server Error',
//                 });
//               }
//             }
//           break;
//           case 'update':
//           result = await createOrUpdateObject(req, Model, true);
//           res.status(200).json({
//             status: 'success',
//             message: `${Model.modelName} updated successfully`,
//             data: result,
//           });
//           break;
//         case 'delete':
//           let documentToDelete = await Model.findById(req.params.id);
//           if (!documentToDelete) {
//             throw new AppError(`${Model.modelName} not found with ID: ${req.params.id}`, 404);
//           }
//           result = await Model.findByIdAndDelete(req.params.id);
//           res.status(200).json({
//             status: 'success',
//             message: `${Model.modelName} deleted successfully`,
//             data: result,
//           });
//           break;
//         default:
//           throw new AppError('Invalid operation', 400);
//       }
//     } catch (error) {
//       next(error);
//     }
//   });
// };

// // Export handler functions
// export const createModelHandler = Model => {
//   return handleModelOperation(Model, 'create');
// };
// export const readModelHandler = Model => {
//   return handleModelOperation(Model, 'read');
// };
// export const updateModelHandler = Model => {
//   return handleModelOperation(Model, 'update');
// };
// export const deleteModelHandler = Model => {
//   return handleModelOperation(Model, 'delete');
// };

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Helper function to check and add categories
const checkAndAddCategories = async (categories) => {
  const uniqueCategories = new Set();
  for (const categoryId of categories) {
    const categoryExists = await Category.findById(categoryId);
    if (categoryExists) {
      uniqueCategories.add(categoryId.toString());
    }
  }
  return Array.from(uniqueCategories);
};

// Helper function to check and add food items
const checkAndAddFoodItems = async (foodItems) => {
  const validFoodItems = [];
  for (const foodItemId of foodItems) {
    const foodItemExists = await foodItem.findById(foodItemId);
    if (foodItemExists) {
      validFoodItems.push(foodItemId);
    } else {
      throw new AppError(`FoodItem not found with ID: ${foodItemId}`, 404);
    }
  }
  return validFoodItems;
};

// Combined create and update function
const createOrUpdateObject = async (req, Model, isUpdate = false) => {
  let newObject = { ...req.body };

  // Handle image uploads
  if (req.files && req.files.images) {
    let imagesArray = [];
    for (let index = 0; index < req.files.images.length; index++) {
      imagesArray.push(
        (await cloudinary.uploader.upload(req.files.images[index].path)).secure_url
      );
    }
    newObject.images = imagesArray;
  }

  if (req.files && req.files.image) {
    newObject.image = (await cloudinary.uploader.upload(req.files.image[0].path)).secure_url;
  }

  // Check and deduplicate categories
  if (newObject.category && newObject.category.length > 0) {
    newObject.category = newObject.category.split(',');
    newObject.category = await checkAndAddCategories(newObject.category);

    if (Model === WeeklyMenu) {
      const { day, foodItems } = newObject;
      const existingMenu = await WeeklyMenu.findOne({ day });

      if (existingMenu) {
        for (const item of foodItems) {
          if (!existingMenu.foodItems.includes(item)) {
            existingMenu.foodItems.push(item);
          }
        }
        await existingMenu.save();
        return existingMenu;
      } else {
        return await WeeklyMenu.create(newObject);
      }
    }
  }

  if (isUpdate) {
    let documentToUpdate = await Model.findById(req.params.id);
    if (!documentToUpdate) {
      throw new AppError(`${Model.modelName} not found with ID: ${req.params.id}`, 404);
    }
    documentToUpdate.set(newObject);
    return await documentToUpdate.save();
  } else {
    let userId = req.userId;
    const schemaPaths = Model.schema.paths;
    if (schemaPaths.userId) {
      newObject.userId = userId;
    }

    if (Model === Payment) {
      const orderId = req.params.orderId;
      const amount = req.body.amount;

      const order = await Order.findById(orderId);
      if (!order) {
        throw new AppError('Order not found', 404);
      }

      if (amount < order.totalPrice) {
        throw new AppError('Payment amount is less than the order total price', 400);
      }
      if (amount > order.totalPrice) {
        throw new AppError('Payment amount is greater than the order total price', 400);
      }

      newObject.orderId = orderId;
      newObject.amount = amount;

      const payment = new Payment(newObject);
      await payment.save();

      order.paymentId = payment._id;
      order.status = 'paid';
      await order.save();

      payment.status = 'completed';
      await payment.save();

      const notification = new Notification({
        message: 'Order paid successfully. Delivery in process.',
        orderId: order._id,
        userId: userId,
        status: 'unread',
      });
      await notification.save();

      return payment;
    }

    if(Model ===Subscription){
if(req.body.type==='monthly'){
  newObject.monthlyAmount=req.body.amount;
  newObject.dailyprice=req.body.amount/30;
}
else if( req.body==='weekly'){
  newObject.weeklyAmount=req.body.amount;
  newObject.dailyprice=req.body.amount/7;
}
    }
    if (Model === Subscriber) {
      const subscriptionId = req.params.subscriptionId;
      newObject.subscriptionId=subscriptionId;
      const subscription = await Subscription.findById(subscriptionId);
      if (!subscription) {
        throw new AppError('Subscription not found', 404);
      }
 // Set start date to the current date if not provided
 if (!newObject.startDate) {
  newObject.startDate = new Date();
}

      newObject.amount = subscription.amount;
     
      newObject.type = subscription.type;
      console.log("newObject.dailyprice",subscription.amount,subscription);
      if (subscription.type === 'monthly') {
        newObject.monthlyAmount = subscription.amount;
        newObject.dailyprice = subscription.amount / 30;
        newObject.endDate = new Date(newObject.startDate);
        newObject.endDate.setDate(newObject.endDate.getDate() + 30);
      } else if (subscription.type === 'weekly',subscription.amount) {
        newObject.weeklyAmount = subscription.amount;
        
        newObject.dailyprice = subscription.amount / 7;
        newObject.endDate = new Date(newObject.startDate);
        newObject.endDate.setDate(newObject.endDate.getDate() + 7);
      }
      console.log(typeof(newObject.amount));
      console.log(req.body.numberOfPeople);
      console.log("numberof peapplle",newObject.numberOfPeople,"hello");
      newObject.totalAmount = newObject.amount * newObject.numberOfPeople;



      const notification = new Notification({
        message: 'subscription made sbscription made succcessfully go and pay for stating.',
        userId: userId,
        status: 'unread',
      });
      await notification.save();
    }


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
          break; // Added break statement
        case 'read':
          let query;
          if (req.userId) {
            if (req.user.role === 'admin') {
              query = Model.find();
            } else {
              if (Model === Order || Model === Payment || Model === Notification || Model === Favorite || Model === Cart) {
                query = Model.find({ userId: req.userId });
              } else {
                query = Model.find();
              }
            }
          } else {
            query = Model.find();
          }

          if (req.params.id) {
            query = query.findById(req.params.id);
          }

          query.populate('foodItems')
            .populate('foodItem')
            .populate('category')
            .populate('orderId')
            .populate('userId')
            .populate('paymentId')
            .populate('reviews')
            .populate('subscriptionId');

          const readResult = await query.exec();
          if (!readResult) {
            return res.status(404).json({
              status: 'error',
              message: `${Model.modelName} not found with ID: ${req.params.id}`,
            });
          }

          // Update status to 'read' if the model is Notification
  if (Model === Notification) {
    readResult.status = 'read';
    await readResult.save();
  }
          res.status(200).json({
            status: 'success',
            message: `${Model.modelName} retrieved successfully`,
            data: readResult,
          });
          break; // Added break statement
        case 'update':
          result = await createOrUpdateObject(req, Model, true);
          res.status(200).json({
            status: 'success',
            message: `${Model.modelName} updated successfully`,
            data: result,
          });
          break; // Added break statement
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
          break; // Added break statement
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
export const searchFoodItems = catchAsync(async (req, res, next) => {
  const searchParams = req.query; // Extract search parameters from query string

  const results = await foodItem.search(searchParams); // Use the static search method
  res.status(200).json({
    status: 'success',
    results: results.length,
    data: results
  });
});