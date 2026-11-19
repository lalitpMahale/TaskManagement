import mongoose from "mongoose";

// const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },


        description: {
            type: String
        },


        status: {
            type: String,
            enum: [
                "PENDING",
                "IN_PROGRESS",
                "COMPLETED"
            ],
            default: "PENDING"
        },


        priority: {
            type: String,
            enum: [
                "LOW",
                "MEDIUM",
                "HIGH",
                "URGENT"
            ],
            default: "MEDIUM"
        },


        dueDate: {
            type: Date,
            required: true
        },


        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },


        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    {
        timestamps: true
    }
);


taskSchema.index({ status: 1, priority: 1, dueDate: 1 });
taskSchema.index({ assignedTo: 1 });


// module.exports = mongoose.model("Task", taskSchema);

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;