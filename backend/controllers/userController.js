import User from "../models/User.js";

// CREATE TEAM MEMBER
const createUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;


        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }


        const existingUser = await User.findOne({ email });


        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }


        const user = await User.create({
            name,
            email,
            role
        });


        res.status(201).json({
            message: "Team member created successfully",
            data: user
        });


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};




// GET ALL TEAM MEMBERS
const getUsers = async (req, res) => {
    try {
        const users = await User.find({
            isActive: true
        }).select("-__v");


        res.status(200).json({
            count: users.length,
            data: users
        });


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};




// GET USER BY ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);


        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        res.status(200).json({
            data: user
        });


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

export {createUser,getUsers,getUserById}