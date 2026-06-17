import  'express-async-errors';
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import http from 'http'
import { connectDb } from "./mongodb/connect.js";
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js'
import paymentRoutes from './routes/payment.route.js'
import orderRoutes from './routes/order.route.js';
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from 'cookie-parser';
import { apiLimiter } from './middlewares/rateLimitter.js';
import { initSocket } from './config/socket.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser())
app.use(apiLimiter) //rate limitter

const server = http.createServer(app);

initSocket(server)


app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/products",productRoutes);
app.use("/api/v1/orders",orderRoutes);
app.use("/api/v1/payments",paymentRoutes);






const port = process.env.PORT || 5000



server.listen(port,async()=>{
    
    console.log(`server running on http://localhost:${port}`);

    await connectDb()

    });

    app.use(errorHandler);