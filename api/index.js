import express from 'express';
import mongoose from'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

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
