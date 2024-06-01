import Notification from "../models/Notification.js";
import Order from "../models/Order.js";
import { AppError, catchAsync } from "../middlewares/globaleerorshandling.js";

export const createNotification = async (message, orderId, userId) => {
    try {
      const notification = new Notification({
        message,
        orderId,
        userId,
      });
  
      await notification.save();
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };
const deliverOrder = catchAsync(async (req, res, next) => {
  const { driverName, driverPhone } = req.body;
  console.log(req.body);

const orderId = req.params.id;
  if ( !driverName || !driverPhone) {
    return next(new AppError(' driver name, and driver phone are required', 400));
  }

  const order = await Order.findById(orderId);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  order.driverName = driverName;
  order.driverPhone = driverPhone;
  order.status = 'delivering';

  await order.save();

  // Notify the user
  const message = `Your order is now out for delivery with driver ${driverName}.`;
  await createNotification(message, order._id, order.userId);

  res.status(200).json({
    status: 'success',
    message: 'Order is now out for delivery',
    data: order
  });
});

export default deliverOrder;
