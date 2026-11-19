import mongoose, { mongo } from 'mongoose'


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },


        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },


        role: {
            type: String,
            enum: ["ADMIN", "MANAGER", "MEMBER"],
            default: "MEMBER"
        },


        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const User =mongoose.User || mongoose.model("User",userSchema)
export default User;