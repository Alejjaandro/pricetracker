import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGO_URI) return console.log('Missing MONGO_URI environment variable');
    if (isConnected) return console.log('=> using existing database connection');

    try {
        await mongoose.connect(process.env.MONGO_URI);

        isConnected = true;
        console.log('=> MongoDB connected');

    } catch (error: any) {
        console.log(`Failed to connect to database: ${error.message}`);
    }
} 