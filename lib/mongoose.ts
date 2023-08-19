import mongoose from 'mongoose';
// check if mongoose is connected or not
let isConnected = false;

export const connectToDB = async () => {
    // prevent unknown field queries
    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URL) return console.log("MONGODB_URL is not defined");

    if(isConnected) return console.log("Already connected to MongoDB");
    
    try {
        const MONGODB_URL = process.env.MONGODB_URL;
        await mongoose.connect(MONGODB_URL);
        isConnected = true;
        console.log("connected to MongoDB");
        
    } catch(error) {
        console.log(error);
        
    }
}