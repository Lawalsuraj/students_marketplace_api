import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import AppError from '../utils/AppError.js';

export const createOrder = async (req, res) => {
  const { productId, quantity } = req.body;

  // find product
  const product = await Product.findById(productId);
  if (!product) throw new AppError('Product not found', 404);
  
  // check if product is available
  if (!product.isAvaillable) {
    throw new AppError('Product is no longer available', 400);
  }

  // buyer cannot buy their own product
  if (product.seller.toString() === req.user.id) {
    throw new AppError('You cannot buy your own product', 400);
  }

  // calculate total amount
  const totalAmount = product.price * quantity;

  const order = await Order.create({
    buyer: req.user.id,
    product: productId,
    quantity,
    totalAmount,
    status: 'pending',
  });

  res.status(201).json({
    success: true,
    data: order,
  });
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ buyer: req.user.id })
    .populate('product', 'title price images')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
};


export const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('product', 'title price images')
    .populate('buyer', 'fullName email');

  if (!order) throw new AppError('Order not found', 404);

  // only buyer or admin can view order
  if (
    order.buyer._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new AppError('Not authorized', 403);
  }

  res.status(200).json({
    success: true,
    data: order,
  });
};


export const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError('Order not found', 404);

  // only buyer can cancel
  if (order.buyer.toString() !== req.user.id) {
    throw new AppError('Not authorized', 403);
  }

  // cannot cancel completed order
  if (order.status === 'completed') {
    throw new AppError('Cannot cancel a completed order', 400);
  }

  order.status = 'cancelled';
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
  });
};


export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate('product', 'title price')
    .populate('buyer', 'fullName email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
};