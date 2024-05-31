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
      const {  paymentMethod, amount } = req.body;
  
      // Find the subscriber
      const subscriber = await Subscriber.findById(subscribId);
      if (!subscriber) {
        return res.status(404).json({ message: "Subscription not found" });
      }
  
      // Verify the payment amount matches the total amount
      if (amount !== subscriber.totalAmount) {
        return res.status(400).json({ message: "Payment amount does not match the subscription total amount" });
      }
  ne
      // Create a new payment
      const newPayment = new Payment({
        userId,
        subscriptionId: subscriber._id,
        amount,
        paymentMethod,
       
        status: 'completed'
      });
  
      await newPayment.save();
  
      // Update subscriber's status and remaining balance
      subscriber.status = 'active';
      subscriber.remianingbalance= 0;
      await subscriber.save();
      
      const notification = new Notification({
        message: 'subscription paid successfully. Delivery in process.',
        orderId: order._id,
        userId: userId,
        status: 'unread',
      });
      await notification.save();
  
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