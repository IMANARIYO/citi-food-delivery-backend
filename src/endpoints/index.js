import DayCategoryRouter from "./daycategory.js";
import authRouter from "./authendspoints.js";
import cartRouter from "./cartEndpoints copy.js";
import categoryRouter from "./categoryEndpoints.js";
import express from "express";
import favoriteRouter from "./favoriteEndpoints.js";
import fooditemRouter from "./fooditemEndpoints.js";
import notificationRouter from "./notificationEndpoints.js";
import orderRouter from "./orderEndpoints.js";
import paymentRouter from "./paymentEndpoints.js";
import reviewRouter from "./reviewEndpoints.js";
import subscribersRouter from "./subscribersendpoints.js";
import subscriptionRouter from "./subscriptionEndpoints.js";
import userRouter from "./userEndpoints.js";
import weeklyMenuRouter from "./weeklymenu.js";

// import cartRouter from "./cartEndpoints.js";



const mainRouter = express.Router()
mainRouter.use('/user', userRouter)
mainRouter.use('/fooditem', fooditemRouter)
mainRouter.use('/category', categoryRouter)
mainRouter.use('/subscription', subscriptionRouter)
mainRouter.use('/order', orderRouter)
mainRouter.use('/review', reviewRouter)
mainRouter.use('/payment', paymentRouter)
mainRouter.use('/favorite', favoriteRouter)
mainRouter.use('/cart', cartRouter)
mainRouter.use('/notification', notificationRouter)
mainRouter.use('/auth',authRouter)
mainRouter.use('/weeklymenu', weeklyMenuRouter)
mainRouter.use('/subscribe', subscribersRouter)
mainRouter.use('/DayCategory', DayCategoryRouter)
export default mainRouter
