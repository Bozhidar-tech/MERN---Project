import express from 'express';
import mongoose from'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';

dotenv.config();

const app = express();
app.use(express.json());

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
