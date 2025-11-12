import express from 'express';
import { userRouter } from './routes/userRouter.js';
import { authRouter } from './routes/authRouter.js';
import {
  categoryRouter,
  productRouter,
  cartRouter,
  paymentRouter,
  orderRouter
} from './routes/shop/index.js';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import AppError from './utils/appError.js';
import globalErrorHandler from './middleware/errorController.js';
//import { morganLogger } from './middleware/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '10kb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(mongoSanitize());

//app.use(await morganLogger());

app.use(cors({
  origin: 'https://e-app-v01.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use((req, res, next) => {
  console.table({
    path: req.url,
    method: req.method
  })
  next();
})

app.use(cookieParser());

//  Routes 
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payment', paymentRouter);


//  Error Handleing
app.all('*', (req, res, next) => {
  return next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;