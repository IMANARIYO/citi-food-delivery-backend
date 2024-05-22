import mongoose from "mongoose";
import mongoose from "mongoose";
import mongoose from "mongoose";
import mongoose from "mongoose";
import mongoose from "mongoose";
import mongoose from "mongoose";
import mongoose from "mongoose";
import mongoose from "mongoose";
import mongoose from "mongoose";
import mongoose from "mongoose";

const fs = require("fs");
const path = require("path");

const models = [
  {
    name: "User",
    content: `

const userSchema = new mongoose.Schema({
  userNames: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String },
  location: { type: String, required: true },
  image: { type: String },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
`
  },
  {
    name: "foodItem",
    content: `

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  availableDays: [{ type: String, required: true }],
  time: { type: String, required: true },
}, { timestamps: true });

const foodItem = mongoose.model('foodItem', foodItemSchema);

export default foodItem;
`
  },
  {
    name: "Category",
    content: `

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;
`
  },
  {
    name: "Subscription",
    content: `

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  numberOfPeople: { type: Number, required: true },
  email: { type: String, required: true },
  type: { type: String, enum: ['weekly', 'monthly'], required: true },
  amount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, default: 'active' },
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
`
  },
  {
    name: "Order",
    content: `

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  items: [{
    foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'foodItem', required: true },
    quantity: { type: Number, required: true },
  }],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
`
  },
  {
    name: "Review",
    content: `

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'foodItem', required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
`
  },
  {
    name: "Payment",
    content: `

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: true },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
`
  },
  {
    name: "Favorite",
    content: `

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'foodItem', required: true },
}, { timestamps: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;
`
  },
  {
    name: "Cart",
    content: `

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'foodItem', required: true },
    quantity: { type: Number, required: true, default: 1 },
  }],
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
`
  },
  {
    name: "Notification",
    content: `

const notificationSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'unread' }, // e.g., 'unread', 'read'
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
`
  }
];

const modelsDirectory = path.join(__dirname, "models");

if (!fs.existsSync(modelsDirectory)) {
  fs.mkdirSync(modelsDirectory);
}

models.forEach(model => {
  const modelPath = path.join(modelsDirectory, `${model.name}.js`);
  fs.writeFileSync(modelPath, model.content.trim());
  console.log(`Model ${model.name} created at ${modelPath}`);
});
