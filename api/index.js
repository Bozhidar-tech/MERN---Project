import express from 'express';
import mongoose from'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';
import propertyRouter from './routes/propertyRouter.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const connectMongoDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
    }catch(error){
        throw error;
    }
}

app.listen(3000, () => {
    connectMongoDB();
    console.log('Listening on port 3000')
    });

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('api/properties', propertyRouter)


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});