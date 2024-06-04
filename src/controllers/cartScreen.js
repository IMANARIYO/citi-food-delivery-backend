import Cart from "../models/Cart.js";
import Notification from "../models/Notification.js";
import Order from "../models/Order.js";

// Utility function to calculate total price
const calculateTotalPrice = (items) => {
  return items.reduce((total, item) => {
    return total + item.foodItem.price * item.quantity;
  }, 0);
};


// Handler function to add or update items in the cart
export const addToCartHandler = async (req, res, next) => {
  try {
    let userId=req.userId;
    let foodItemId=req.params.foodItemId;

    let quantity=1;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, foodItems: [{ foodItem: foodItemId, quantity }] });
    } else {
      // Check if the food item already exists in the cart
      const existingItemIndex = cart.foodItems.findIndex(item => item.foodItem.equals(foodItemId));

      if (existingItemIndex !== -1) {
        // If the item exists, update its quantity
        cart.foodItems[existingItemIndex].quantity += quantity;
      } else {
        // If the item doesn't exist, add it to the cart
        cart.foodItems.push({ foodItem: foodItemId, quantity });
      }
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      status: 'success',
      message: 'Item(s) added to cart successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// Handler function to get all items in the cart for a given user
export const getCartHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({ userId }).populate('foodItems.foodItem');

    if (!cart) {
      return res.status(404).json({
        status: 'fail',
        message: 'Cart not found for user',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Cart retrieved successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};
// Handler function to update item quantity in the cart
export const updateCartHandler = async (req, res, next) => {
  try {
    const { userId, foodItemId, quantity } = req.body;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new AppError('Cart not found for user', 404);
    }

    const itemIndex = cart.foodItems.findIndex(item => item.foodItem.equals(foodItemId));

    if (itemIndex === -1) {
      throw new AppError('Item not found in cart', 404);
    }

    // Update the quantity of the item
    cart.foodItems[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({
      status: 'success',
      message: 'Cart updated successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// Handler function to remove item from the cart
export const removeFromCartHandler = async (req, res, next) => {
  try {
    const { userId, foodItemId } = req.body;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new AppError('Cart not found for user', 404);
    }

    // Remove the item from the cart
    cart.foodItems = cart.foodItems.filter(item => !item.foodItem.equals(foodItemId));
    await cart.save();

    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};
// Handler function to checkout and create an order
export const checkoutHandler = async (req, res, next) => {
  try {
    let userId = req.userId 
  

    // Find the user's cart
    const cart = await Cart.findOne({ userId }).populate('foodItems.foodItem');

    if (!cart || cart.foodItems.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // Calculate total price
    const totalPrice = calculateTotalPrice(cart.foodItems);

    // Create a new order based on the cart contents
    const order = new Order({
      delivelinglocation:req.user.delivelinglocation,
      userId: cart.userId,
      email: req.user.email, // Assuming user's email is stored in req.user.email
      items: cart.foodItems.map(item => ({
        foodItem: item.foodItem._id,
        quantity: item.quantity
      })),
      totalPrice: totalPrice,
    });

    // Save the order to the database
    await order.save();

    // Clear the user's cart
    await Cart.findOneAndDelete({ userId });
     // Create a notification for the new order
     const notification = new Notification({
      orderId: order._id,
      userId: req.userId,
      status: 'unread',
      message: `New order placed for ${totalPrice}`,
    });

    // Save the notification to the database
    await notification.save();

    res.status(200).json({
      status: 'success',
      message: 'Order placed successfully and corresiponding notification made successsfull',
      order: order,
      notification :notification 
    });
  } catch (error) {
    next(error);
  }
};
