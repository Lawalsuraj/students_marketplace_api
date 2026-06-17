import express from 'express';
import { initializePayment, webhook } from '../controllers/payment.controller.js';
import { verify } from '../middlewares/secure.js';

const router = express.Router();

router.post('/initialize', verify, initializePayment);
router.post('/webhook', webhook);

export default router;