import Task from "../models/Task.js";

export const getDashboardStats = async (req, res) => {
    try {
        const stats = await Task.aggregate([
            {
                $group: {
                    _id: null,
                    totalTasks: {
                        $sum: 1
                    },


                    pendingTasks: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "PENDING"] },
                                1,
                                0
                            ]
                        }
                    },


                    inProgressTasks: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "IN_PROGRESS"] },
                                1,
                                0
                            ]
                        }
                    },


                    completedTasks: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "COMPLETED"] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalTasks: 1,
                    pendingTasks: 1,
                    inProgressTasks: 1,
                    completedTasks: 1
                }
            }
        ]);


        res.status(200).json({
            data: stats[0] || {
                totalTasks: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0
            }
        });


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};