import fs from 'fs'
import Task from '../models/Task.js'
import User from '../models/User.js'

// const Task = require("../models/Task");
// const User = require("../models/User");


// CREATE TASK
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo
        } = req.body;


        if (!title || !dueDate) {
            return res.status(400).json({
                message: "Title and due date are required"
            });
        }


        if (assignedTo) {
            const user = await User.findOne({
                _id: assignedTo,
                isActive: true
            });


            if (!user) {
                return res.status(400).json({
                    message: "Invalid team member"
                });
            }
        }


        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo: assignedTo || null
        });


        const result = await task.populate(
            "assignedTo",
            "name email role"
        );


        res.status(201).json({
            message: "Task created successfully",
            data: result
        });


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};




// GET ALL TASKS WITH FILTERING
const getTasks = async (req, res) => {
    try {
        const {
            status,
            priority,
            dueDate,
            assignedTo
        } = req.query;


        const filter = {};


        if (status) {
            filter.status = status;
        }


        if (priority) {
            filter.priority = priority;
        }


        if (assignedTo) {
            filter.assignedTo = assignedTo;
        }


        if (dueDate) {
            const start = new Date(`${dueDate}T00:00:00.000Z`);
            const end = new Date(`${dueDate}T00:00:00.000Z`);
            end.setUTCDate(end.getUTCDate() + 1);


            filter.dueDate = {
                $gte: start,
                $lt: end
            };
        }


        const tasks = await Task.find(filter)
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 });


        res.status(200).json({
            count: tasks.length,
            data: tasks
        });


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};




// GET TASK BY ID
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "name email role");


        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }


        res.status(200).json({
            data: task
        });


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};




// UPDATE TASK
const updateTask = async (req, res) => {
    try {
        const allowedFields = [
            "title",
            "description",
            "status",
            "priority",
            "dueDate",
            "assignedTo"
        ];


        const updates = {};


        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }


        if (updates.assignedTo) {
            const user = await User.findOne({
                _id: updates.assignedTo,
                isActive: true
            });


            if (!user) {
                return res.status(400).json({
                    message: "Invalid team member"
                });
            }
        }


        const task = await Task.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        ).populate("assignedTo", "name email");


        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }


        res.status(200).json({
            message: "Task updated successfully",
            data: task
        });


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};




// UPDATE TASK STATUS
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;


        const validStatuses = [
            "PENDING",
            "IN_PROGRESS",
            "COMPLETED"
        ];


        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid task status"
            });
        }


        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );


        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }


        res.status(200).json({
            message: "Task status updated successfully",
            data: task
        });


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};




// DELETE TASK
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(
            req.params.id
        );


        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }


        res.status(200).json({
            message: "Task deleted successfully"
        });


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
export {
    createTask,
    deleteTask,
    getTaskById,
    getTasks,
    updateTask,
    updateTaskStatus
};