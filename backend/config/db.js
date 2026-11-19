import mongoose from "mongoose";

export const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is not set. Add it to the backend .env file.");
    }

    await mongoose.connect(mongoUri, { dbName: "userManagement" });
    console.log("Connected to MongoDB database userManagement");
};
