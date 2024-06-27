import Cart from "../models/Cart.js";
import Notification from "../models/Notification.js";
import Payment from "../models/Payment.js";
import Subscriber from "../models/subscribers.js";
import Subscription from "../models/Subscription.js";
import express from "express";
import { createModelHandler, deleteModelHandler, readModelHandler, updateModelHandler } from "../controllers/crud.js";
import { verifyingtoken } from "../utils/jwtfunctions.js";

const subscribersRouter = express.Router();
subscribersRouter.use(verifyingtoken);
subscribersRouter.post('/subscribefor/:subscriptionId', createModelHandler(Subscriber));
subscribersRouter.get('/get-all', readModelHandler(Subscriber));
subscribersRouter.put('/getby-id/:id', updateModelHandler(Subscriber));
subscribersRouter.delete('/delete/:id', deleteModelHandler(Subscriber));
// New route to handle payment
subscribersRouter.post('/pay/:subscribId', async (req, res) => {
  try {
    const { subscribId } = req.params;
    let userId = req.userId;
    const { paymentMethod, amount, groupPayments } = req.body;
    // Find the subscriber
    const subscriber = await Subscriber.findById(subscribId);
    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
      }
      
      let totalPaymentAmount;
      let newPaymentData = {
        userId,
        subscriptionId: subscriber._id,
        paymentMethod,
        status: 'completed'
        };
        
        if (Array.isArray(groupPayments) && groupPayments.length > 0) {
          // Handle group payment
          console.log("____________________________________________________________________here");
      totalPaymentAmount = groupPayments.reduce((total, payment) => total + payment.amount, 0);
      newPaymentData.groupPayments = groupPayments;
    } else {
      // Handle individual payment
      totalPaymentAmount = amount;
      newPaymentData.amount = amount;
      newPaymentData.phoneNumber = req.body.phoneNumber || req.user.phoneNumber;
      if (!newPaymentData.phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
      }
    }

    // Verify the total payment amount matches the subscription total amount
    if (totalPaymentAmount !== subscriber.totalAmount) {
      return res.status(400).json({ message: "Payment amount does not match the subscription total amount" });
    }

    // Create a new payment
    const newPayment = new Payment(newPaymentData);
    await newPayment.save();

    // Update subscriber's status and remaining balance
    subscriber.status = 'active';
   
    await subscriber.save();
    const paymentSuccessful = true; // Replace with actual payment result

    if (paymentSuccessful) {
      // Find and delete the associated notification
      const notification = await Notification.findOne({ subscriber: subscribId });
      if (notification) {
        await Notification.findByIdAndDelete(notification._id);
      }
    }

  
    // // Create a notification
    // const notification = new Notification({
    //   message: 'Subscription paid successfully. Delivery in process.',
    //   userId: userId,
    //   status: 'unread',
    // });
    // await notification.save();

    res.status(201).json({
      status: 'success',
      message: 'Payment processed successfully',
      data: {
        payment: newPayment,
        subscriber
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: error.message
    });
  }
});


export default subscribersRouter;