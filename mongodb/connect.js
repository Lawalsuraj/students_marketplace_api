import mongoose from "mongoose";

export const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.mongodb_url);

        console.log("mongodb connected successfully");
        
    } catch (error) {

        throw new Error("mongodb connection error");
        
    }
}