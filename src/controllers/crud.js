import Cart from "../models/Cart.js";
import Category from "../models/Category.js";
import Favorite from "../models/Favorite.js";
import Notification from "../models/Notification.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Restourant from "../models/restoutantprofile.js";
import Subscriber from "../models/subscribers.js";
import Subscription from "../models/Subscription.js";
import WeeklyMenu from "../models/WeeklyMenu.js";
import dotenv from "dotenv";
import foodItem from "../models/foodItem.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { AppError, catchAsync } from "../middlewares/globaleerorshandling.js";
import { weekDay } from "../models/Weekday.js";
import { DayCategory } from "../models/dayCategory.js";

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

// Helper function to delete existing weekly menu for a specific day
const deleteExistingWeeklyMenu = async day => {
  console.log(`Deleting existing weekly menu for ${day}`)
  await WeeklyMenu.findOneAndDelete({ day })
}

// Helper function to check and add categories
const checkAndAddCategories = async categories => {
  const uniqueCategories = new Set()
  for (const categoryId of categories) {
    const categoryExists = await Category.findById(categoryId)
    if (categoryExists) {
      uniqueCategories.add(categoryId.toString())
    }
  }
  return Array.from(uniqueCategories)
}

// Helper function to check and add food items
const checkAndAddFoodItems = async foodItems => {
  const validFoodItems = []
  for (const foodItemId of foodItems) {
    const foodItemExists = await foodItem.findById(foodItemId)
    if (foodItemExists) {
      validFoodItems.push(foodItemId)
    } else {
      throw new AppError(`FoodItem not found with ID: ${foodItemId}`, 404)
    }
  }
  return validFoodItems
}

// Combined create and update function
const createOrUpdateObject = async (res, req, Model, isUpdate = false) => {
  let newObject = { ...req.body }

  // Handle image uploads
  if (req.files && req.files.images) {
    let imagesArray = []
    for (let index = 0; index < req.files.images.length; index++) {
      imagesArray.push(
        (await cloudinary.uploader.upload(req.files.images[index].path))
          .secure_url
      )
    }
    newObject.images = imagesArray
  }

  if (req.files && req.files.image) {
    const file = req.files.image[0]
    // Check if the file is an image
    if (!file.mimetype.startsWith('image/')) {
      throw new AppError('Uploaded file is not an image', 400)
    }

    // Check if the file has content
    if (!file.size) {
      throw new AppError('Uploaded image is empty', 400)
    }
    newObject.image = (await cloudinary.uploader.upload(
      req.files.image[0].path
    )).secure_url
  }

  // Check and deduplicate categories
  if (newObject.category && newObject.category.length > 0) {
    newObject.category = newObject.category.split(',')
    newObject.category = await checkAndAddCategories(newObject.category)
  }

  if (isUpdate) {
    let documentToUpdate = await Model.findById(req.params.id)
    if (!documentToUpdate) {
      throw new AppError(
        `${Model.modelName} not found with ID: ${req.params.id}`,
        404
      )
    }
    documentToUpdate.set(newObject)
    return await documentToUpdate.save()
  } else {
    let userId = req.userId
    const schemaPaths = Model.schema.paths
    if (schemaPaths.userId) {
      newObject.userId = userId
    }

    if (Model === Payment) {
      let userId = req.userId
      newObject.userId = userId
      const orderId = req.params.orderId
      const amount = req.body.amount
      const phonenumber = req.body.phonenumber
        ? req.body.phonenumber
        : req.user.phoneNumber
      if (!phonenumber) {
        return res.status(400).json({ error: 'Phone number is required' })
      }
      newObject.phoneNumber = phonenumber
      const order = await Order.findById(orderId)
      if (!order) {
        throw new AppError('Order not found', 404)
      }
      if (Model === Payment) {
        const orderId = req.params.orderId
        const order = await Order.findById(orderId)
        if (!order) {
          throw new AppError('Order not found', 404)
        }

        if (order.status === 'paid') {
          throw new AppError('Order is already paid', 400)
        }

        const isGroupPayment =
          Array.isArray(newObject.groupPayments) &&
          newObject.groupPayments.length > 0
        if (isGroupPayment) {
          // Calculate the total group payment amount
          const totalGroupAmount = newObject.groupPayments.reduce(
            (total, payment) => total + payment.amount,
            0
          )

          if (totalGroupAmount !== order.totalPrice) {
            throw new AppError(
              'Total group payment amount does not match the order total price',
              400
            )
          }

          newObject.amount = totalGroupAmount
        } else {
          const amount = req.body.amount
          const phoneNumber = req.body.phoneNumber || req.user.phoneNumber
          if (!phoneNumber) {
            throw new AppError('Phone number is required', 400)
          }

          if (amount < order.totalPrice || amount > order.totalPrice) {
            throw new AppError(
              'Payment amount does not match the order total price',
              400
            )
          }

          newObject.phoneNumber = phoneNumber
          newObject.amount = amount
        }

        newObject.orderId = orderId

        const payment = new Payment(newObject)
        await payment.save()

        const paymentSuccessful = true // Replace with actual payment result

        if (paymentSuccessful) {
          // Find and delete the associated notification
          const notificationId = order.orderId // Assuming the order has a notificationId field
          if (notificationId) {
            await Notification.findByIdAndDelete(notificationId)
          }
        }

        order.paymentId = payment._id
        order.status = 'paid'
        await order.save()

        payment.status = 'completed'
        await payment.save()

        const notification = new Notification({
          message: 'Order paid successfully. Delivery in process.',
          orderId: order._id,
          userId: userId,
          status: 'unread'
        })
        await notification.save()

        return payment
      }
      if (amount < order.totalPrice) {
        throw new AppError(
          'Payment amount is less than the order total price',
          400
        )
      }
      if (amount > order.totalPrice) {
        throw new AppError(
          'Payment amount is greater than the order total price',
          400
        )
      }

      newObject.orderId = orderId
      newObject.amount = amount

      const payment = new Payment(newObject)
      await payment.save()

      order.paymentId = payment._id
      order.status = 'paid'
      await order.save()

      payment.status = 'completed'
      await payment.save()

      const notification = new Notification({
        message: 'Order paid successfully. Delivery in process.',

        userId: userId,
        status: 'unread'
      })
      await notification.save()

      return payment
    }

    if (Model === Subscription) {
      const { type, amount, dayCategory } = req.body

      const existingSubscription = await Subscription.findOne({
        type,
        dayCategory
      })
      if (existingSubscription) {
        throw new AppError(
          `A ${type} subscription for the ${dayCategory} already exists.`,
          400
        )
      }

      if (req.body.type === 'monthly') {
        newObject.monthlyAmount = req.body.amount
        newObject.dailyprice = req.body.amount / 30
      } else if (req.body.type === 'weekly') {
        newObject.weeklyAmount = req.body.amount
        newObject.dailyprice = req.body.amount / 7
        newObject.type = req.body.type
      } else if (req.body.type === 'bi-weekly') {
        newObject.biWeeklyAmount = req.body.amount
        newObject.dailyprice = req.body.amount / 15
        newObject.type = req.body.type
      }
    }
    if (Model === Restourant) {
      const { latitude, longitude,locatrion, newObject } = {...req.body};
      await Restourant.deleteMany({})
    }
    if (Model === DayCategory) {
      const { name, day, foodItems } = req.body

      // Check if foodItems is provided and if it's an array
      if (foodItems && !Array.isArray(foodItems)) {
        throw new AppError('If provided, foodItems must be an array.', 400)
      }

      let existingDayCategory = await DayCategory.findOne({ name, day })

      if (existingDayCategory) {
        if (foodItems) {
          // Add new foodItems to existingDayCategory if they do not already exist
          foodItems.forEach(foodItemId => {
            if (!existingDayCategory.foodItems.includes(foodItemId)) {
              existingDayCategory.foodItems.push(foodItemId)
            }
          })

          // Save the updated day category
          await existingDayCategory.save()

          res.status(200).json({
            status: 'success',
            message: `Day category updated successfully with new food items for ${day}.`,
            data: existingDayCategory
          })

          return existingDayCategory
        } else {
          res.status(200).json({
            status: 'success',
            message: `Day category already exists for ${day}. No changes made to food items.`,
            data: existingDayCategory
          })

          return existingDayCategory
        }
      } else {
        // Create a new day category with provided foodItems or an empty array if none provided
        const newDayCategory = new DayCategory({
          name,
          day,
          foodItems: foodItems || []
        })
        await newDayCategory.save()

        res.status(201).json({
          status: 'success',
          message: `Day category created successfully for ${day}.`,
          data: newDayCategory
        })

        return newDayCategory
      }
    }

    if (Model === Subscriber) {
      const subscriptionId = req.params.subscriptionId
      newObject.subscriptionId = subscriptionId

      const subscription = await Subscription.findById(subscriptionId)
      if (!subscription) {
        throw new AppError(
          `Subscription not found fiound for ${subscriptionId}`,
          404
        )
      }
      // const{newObject}={...subscription};
      // Set start date to the current date if not provided
      if (!newObject.startDate) {
        newObject.startDate = new Date()
      }
      if (subscription.type === 'monthly') {
        newObject.monthlyAmount = subscription.amount
        newObject.dailyprice = subscription.amount / 30
        newObject.endDate = new Date(newObject.startDate)
        newObject.endDate.setDate(newObject.endDate.getDate() + 30)
      } else if ((subscription.type === 'weekly', subscription.amount)) {
        newObject.weeklyAmount = subscription.amount

        newObject.dailyprice = subscription.amount / 7
        newObject.endDate = new Date(newObject.startDate)
        newObject.endDate.setDate(newObject.endDate.getDate() + 7)
      } else if ((subscription.type === 'bi-weekly', subscription.amount)) {
        newObject.biWeeklyAmount = subscription.amount
        newObject.dailyprice = subscription.amount / 15
        newObject.endDate = new Date(newObject.startDate)
        newObject.endDate.setDate(newObject.endDate.getDate() + 15)
      }

      newObject.userId = req.userId
      newObject.numberOfPeople = req.body.numberOfPeople
      newObject.totalAmount = subscription.amount * newObject.numberOfPeople
      newObject.dayCategory = subscription.dayCategory
      newObject.menu = subscription.menu
    }
    if (Model === WeeklyMenu) {
      await WeeklyMenu.deleteMany({})
      let existingMenu = await WeeklyMenu.findOne()
      const days = Object.keys(newObject)
      for (const day of days) {
        if (typeof newObject[day] === 'object') {
          // Find existing weekly menu

          if (existingMenu) {
            // Delete existing data for the specified day
            if (existingMenu[day]) {
              existingMenu[day] = undefined
            }
          } else {
            // If no existing menu, create a new one
            existingMenu = new WeeklyMenu()
          }
          // Prepare new data for the specified day
          for (const mealTime of ['morning', 'lunch', 'dinner']) {
            if (
              newObject[day][mealTime] &&
              newObject[day][mealTime].foodItems
            ) {
              newObject[day][mealTime].foodItems = await checkAndAddFoodItems(
                newObject[day][mealTime].foodItems
              )
            }
          }

          // Add new data for the specified day to the existingMenu
          existingMenu[day] = newObject[day]
        }
      }

      await existingMenu.save()
    }

    // Helper function to check and add food items
    async function checkAndAddFoodItems (foodItems) {
      const FoodItem = mongoose.model('foodItem')
      const foodItemPromises = foodItems.map(async itemId => {
        const foodItem = await FoodItem.findById(itemId)
        if (!foodItem) {
          throw new Error(`FoodItem with ID ${itemId} not found`)
        }
        return itemId
      })

      return Promise.all(foodItemPromises)
    }
    let newthing = await Model.create(newObject)
   
    return newthing
  }
}

// Handler functions
const handleModelOperation = (Model, operation) => {
  return catchAsync(async (req, res, next) => {
    try {
      let result
      switch (operation) {
        case 'create':
          if (Model === Favorite) {
            const userId = req.userId
            const foodItemId = req.body.foodItem

            // Check if the favorite already exists
            const existingFavorite = await Favorite.findOne({
              userId,
              foodItem: foodItemId
            })
            if (existingFavorite) {
              // Remove the favorite if it exists
              await Favorite.findByIdAndDelete(existingFavorite._id)
              res.status(200).json({
                status: 'success',
                message: 'Favorite removed successfully',
                data: existingFavorite
              })
            } else {
              // Add the favorite if it doesn't exist
              const newFavorite = new Favorite({
                userId,
                foodItem: foodItemId
              })
              result = await newFavorite.save()
              res.status(201).json({
                status: 'success',
                message: 'Favorite added successfully',
                data: result
              })
            }
          } else {
            result = await createOrUpdateObject(res, req, Model)
            res.status(201).json({
              status: 'success',
              message: `${Model.modelName} created successfully`,
              data: result
            })
          }
          break ;
        case 'read':
          let query
          if (req.userId) {
            if (req.user.role === 'admin') {
              query = Model.find()
            } else {
              if (
                Model === Order ||
                Model === Payment ||
                Model === Notification ||
                Model === Favorite ||
                Model === Cart ||
                Model === Subscriber
              ) {
                query = Model.find({ userId: req.userId ,deleted: false})
              } else {
                query = Model.find({deleted: false})
              }
            }
          } else {
            query = Model.find({deleted:false})
          }

          if (req.params.id) {
            query = Model.findById(req.params.id).where('deleted', false);
          }

          query
            .populate('foodItems')
            .populate('foodItem')
            .populate('category')
            .populate('orderId')
            .populate('userId')
            .populate('paymentId')
            .populate('reviews')
            .populate('subscriptionId')
            .populate('dayCategories')
            .populate('subscriber')
            .populate({
              path: 'menu.foodItems',
              populate: {
                path: 'category',
                model: 'Category'
              }
            })
            .populate({
              path: 'foodItems',
              populate: {
                path: 'category',
                model: 'Category'
              }
            })
            .populate({
              path: 'items.foodItem',
              populate: {
                path: 'category'
              }
            })
            .populate({
              path: 'items',
              populate: {
                path: 'foodItem'
              }
            })
            .populate({
              path: 'foodItem',
              populate: {
                path: 'category'
              }
            })
          // Comprehensive population for Notification model
          if (Model === Notification) {
            query
              .populate('userId')
              .populate({
                path: 'orderId',
                populate: {
                  path: 'userId',
                  model: 'User'
                }
              })
              .populate({
                path: 'orderId',
                populate: {
                  path: 'items.foodItem',
                  populate: {
                    path: 'category',
                    model: 'Category'
                  }
                }
              })
          }

          const readResult = await query.exec()
          if (!readResult) {
            return res.status(404).json({
              status: 'error',
              message: `${Model.modelName} not found with ID: ${req.params.id}`
            })
          }

          // Update status to 'read' if the model is Notification
          if (req.params.id && Model === Notification) {
            readResult.status = 'read'
            await readResult.save()
          }
          res.status(200).json({
            status: 'success',
            message: `${Model.modelName} retrieved successfully`,
            data: readResult
          })
          break // Added break statement
        case 'update':
          result = await createOrUpdateObject(res, req, Model, true)
          res.status(200).json({
            status: 'success',
            message: `${Model.modelName} updated successfully`,
            data: result
          })
          break // Added break statement
        case 'delete':
          let documentToDelete = await Model.findById(req.params.id)
          if (!documentToDelete) {
            throw new AppError(
              `${Model.modelName} not found with ID: ${req.params.id}`,
              404
            )
          }
          // result = await Model.findByIdAndDelete(req.params.id)
          documentToDelete.deleted = true;
          await documentToDelete.save();
          res.status(200).json({
            status: 'success',
            message: `${Model.modelName} deleted successfully`,
            data: result
          })
          break // Added break statement
        default:
          throw new AppError('Invalid operation', 400)
      }
    } catch (error) {
      next(error)
    }
  })
}

// Export handler functions
export const createModelHandler = Model => {
  return handleModelOperation(Model, 'create')
}
export const readModelHandler = Model => {
  return handleModelOperation(Model, 'read')
}
export const updateModelHandler = Model => {
  return handleModelOperation(Model, 'update')
}
export const deleteModelHandler = Model => {
  return handleModelOperation(Model, 'delete')
}
export const searchFoodItems = catchAsync(async (req, res, next) => {
  const searchParams = req.query // Extract search parameters from query string

  const results = await foodItem.search(searchParams) // Use the static search method
  res.status(200).json({
    status: 'success',
    results: results.length,
    data: results
  })
})
