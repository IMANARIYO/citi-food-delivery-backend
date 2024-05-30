import ManagerSettings from "../models/ManagerSettings";
import Payment from "../models/Payment";
import Subscription from "../models/Subscription";
import mongoose from "mongoose";

// Function to calculate end date based on amount and cost per day
function calculateEndDate(startDate, amount, dailyCost) {
  const days = Math.floor(amount / dailyCost);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days);
  return endDate;
}

// Function to create a subscription
async function createSubscription(userId, numberOfPeople, email, type, amount) {
  // Get manager settings
  const managerSettings = await ManagerSettings.findOne();
  if (!managerSettings) throw new Error('Manager settings not found');

  const { dailyCost, weeklyCost, monthlyCost } = managerSettings;
  let cost = 0;

  // Calculate cost based on subscription type
  if (type === 'weekly') {
    cost = weeklyCost * numberOfPeople;
  } else if (type === 'monthly') {
    cost = monthlyCost * numberOfPeople;
  }

  // Calculate start date and end date
  const startDate = new Date();
  const endDate = calculateEndDate(startDate, amount, dailyCost);

  // Create new subscription
  const subscription = new Subscription({
    userId,
    numberOfPeople,
    email,
    type,
    amount,
    startDate,
    endDate,
    status: 'active'
  });

  await subscription.save();
  return subscription;
}

// Function to update subscription with new amount
async function updateSubscription(subscriptionId, additionalAmount) {
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new Error('Subscription not found');

  // Get manager settings
  const managerSettings = await ManagerSettings.findOne();
  if (!managerSettings) throw new Error('Manager settings not found');

  const { dailyCost } = managerSettings;

  // Calculate new end date
  const remainingAmount = subscription.amount + additionalAmount;
  const endDate = calculateEndDate(subscription.startDate, remainingAmount, dailyCost);

  // Update subscription
  subscription.amount = remainingAmount;
  subscription.endDate = endDate;
  await subscription.save();

  return subscription;
}

// Function to pause subscription
async function pauseSubscription(subscriptionId) {
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new Error('Subscription not found');

  subscription.status = 'paused';
  await subscription.save();

  return subscription;
}

// Function to resume subscription
async function resumeSubscription(subscriptionId) {
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new Error('Subscription not found');

  subscription.status = 'active';
  await subscription.save();

  return subscription;
}

// Function to handle payment
async function handlePayment(userId, subscriptionId, amount, paymentMethod, transactionId) {
  const payment = new Payment({
    userId,
    subscriptionId,
    amount,
    paymentMethod,
    transactionId,
    status: 'completed'
  });

  await payment.save();

  // Update subscription with new amount
  const updatedSubscription = await updateSubscription(subscriptionId, amount);

  return { payment, updatedSubscription };
}
// Function to get subscriptions by user ID
async function getSubscriptionsByUserId(userId) {
  const subscriptions = await Subscription.find({ userId });
  return subscriptions;
}

// Function to get subscription by ID
async function getSubscriptionById(subscriptionId) {
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new Error('Subscription not found');
  return subscription;
}

// Function to delete subscription
async function deleteSubscription(subscriptionId) {
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new Error('Subscription not found');
  await subscription.remove();
  return { message: 'Subscription deleted successfully' };
}
export {
  createSubscription,
  updateSubscription,
  pauseSubscription,
  resumeSubscription,
  handlePayment,
  getSubscriptionsByUserId,
  getSubscriptionById,
  deleteSubscription
};





















