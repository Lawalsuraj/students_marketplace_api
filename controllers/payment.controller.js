import axios from 'axios';
import crypto from 'crypto';
import Order from '../models/order.model.js';
import AppError from '../utils/AppError.js';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

//INITIALIZE PAYMENT
export const initializePayment = async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) throw new AppError('Order not found', 404);

  if (order.buyer.toString() !== req.user.id) {
    throw new AppError('Not authorized', 403);
  }

  if (order.status !== 'pending') {
    throw new AppError('Order is not pending', 400);
  }

  const response = await axios.post(
    'https://api.paystack.co/transaction/initialize',
    {
      email: req.user.email,
      amount: order.totalAmount * 100,
      reference: order._id.toString(),
    },
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
      },
    }
  );

  res.status(200).json({
    success: true,
    paymentUrl: response.data.data.authorization_url,
  });
};

//WEBHOOK 
export const webhook = async (req, res) => {
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    throw new AppError('Invalid signature', 401);
  }

  const { event, data } = req.body;

  if (event === 'charge.success') {
    const order = await Order.findById(data.reference);

    if (order) {
      order.status = 'completed';
      order.paidAt = new Date();
      await order.save();
    }
  }

  res.status(200).json({ received: true });
};