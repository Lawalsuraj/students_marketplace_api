import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
} from '../controllers/order.controller.js';
import { verify, restrictTo } from '../middlewares/secure.js';

const router = express.Router();

router.use(verify);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

// admin only
router.get('/', restrictTo('admin'), getAllOrders);

export default router;