import mongoose from 'mongoose';
import { config } from './config.js';

export const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(config.mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB. Proceeding without database functionality.');
    }
};
