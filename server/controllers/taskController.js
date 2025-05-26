import Task from "../models/Task.js";
import User from "../models/User.js";
import Notice from "../models/notification.js";
import mongoose from "mongoose";

// Helper function to check task permissions
const checkTaskPermission = async (req, task, action) => {
  const { userID, permissions, isAdmin } = req.user;
  
  // Admin can do everything
  if (isAdmin) return true;
  
  // Allow all authenticated users to view tasks
  if (action === 'view') return true;

  // Check if user is assigned to the task
  const isAssigned = task.team.includes(userID);
  
  switch(action) {
    case 'edit':
      return permissions.canEditAllTasks || isAssigned;
    case 'delete':
      return permissions.canDeleteTasks;
    case 'assign':
      return permissions.canAssignTasks;
    default:
      return false;
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, startDate, dueDate, description, priority, stage, team = [], assets } = req.body;
    const { userID, isAdmin } = req.user;

    // Validate required fields
    if (!title || !startDate || !dueDate) {
      return res.status(400).json({
        status: false, 
        message: "Please provide all required fields: title, startDate, and dueDate",
      });
    }

    // Ensure the creator is always in the team for regular users
    let finalTeam = Array.isArray(team) ? [...team] : [];
    // Always add the creator to the team, whether admin or not
    if (!finalTeam.includes(userID)) {
      finalTeam.push(userID);
    }

    // Create new task
    const task = await Task.create({
      title,
      startDate,
      dueDate,
      description,
      priority,
      stage,
      team: finalTeam,
      assets,
      createdBy: userID, // Always set the creator
    });

    // Populate the created task with user information
    const populatedTask = await Task.findById(task._id)
      .populate({
        path: "createdBy",
        select: "name email",
        options: { strictPopulate: false }
      })
      .populate("team", "name email");

    // Send notification to all team members including creator
    if (finalTeam.length > 0) {
      let text = "New task has been assigned to you";
      if (finalTeam.length > 1) {
        text = text + ` and ${finalTeam.length - 1} others.`;
      }
      text = text + ` The task priority is set a ${priority} priority, so check and act accordingly. The task date is ${new Date(dueDate).toDateString()}. Thank you!!!`;

      await Notice.create({
        team: finalTeam,
        text,
        task: task._id,
    });
    }

    res.status(201).json({
      status: true, 
      message: "Task created successfully",
      data: populatedTask,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      status: false,
      message: error.message || "Error creating task",
    });
  }
};

export const duplicateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    const newTask = await Task.create({
      ...task,
      title: task.title + " - Duplicate",
    });

    newTask.team = task.team;
    newTask.subTasks = task.subTasks;
    newTask.assets = task.assets;
    newTask.priority = task.priority;
    newTask.stage = task.stage;

    await newTask.save();
    //alert the user of the task
    let text = "New task has been assigned to you";
    if (task.team.length > 1) {
      text = text + ` and ${task.team.length - 1} others.`;
    }
    text =
      text +
      ` The task priority is set a ${
        task.priority
      } priority, so check and act accordingly. The task date is ${task.date.toDateString()}. Thank you!!!`;

    await Notice.create({
      team: task.team,
      text,
      task: newTask._id,
    });
    res.status(200).json({
      status: true,
      message: "Task duplicated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const postTaskActivity = async (req, res) => {
  const { id } = req.params;
  const { type, activity } = req.body.data || req.body;

  try {
    if (!type || !activity) {
      return res.status(400).json({
        status: false,
        message: "Type and activity are required",
      });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    const newActivity = {
      type,
      activity,
      by: req.user._id,
      date: new Date()
    };

    task.activities.push(newActivity);
    await task.save();

    // Populate the activities with user information
    const populatedTask = await Task.findById(task._id)
      .populate({
        path: "activities.by",
        select: "name",
      });

    res.status(200).json({
      status: true,
      message: "Activity added successfully",
      task: populatedTask
    });
  } catch (error) {
    console.error("Error posting activity:", error);
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export const dashboardStatistics = async (req, res) => {
  try {
    const { userID, isAdmin } = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    // Create base query for non-trashed tasks
    const baseQuery = {
      isTrashed: false,
      ...(search && {
        title: { $regex: search, $options: 'i' }
      }),
      ...(!isAdmin && { 
        team: userID // Match tasks where the user's ID is in the team array
      })
    };

    // Get all tasks for counting (without pagination)
    const allTasksForCounting = await Task.find(baseQuery);
    console.log('Total tasks found:', allTasksForCounting.length);
    
    // Initialize counts for each stage
    const stageCounts = {
      todo: 0,
      "in progress": 0,
      completed: 0
    };

    // Count tasks by stage from all tasks
    allTasksForCounting.forEach(task => {
      const stage = task.stage.toLowerCase();
      if (stageCounts.hasOwnProperty(stage)) {
        stageCounts[stage]++;
      }
    });

    console.log('Stage counts:', stageCounts);

    // Get paginated tasks for display
    const allTasks = await Task.find(baseQuery)
      .populate({
        path: "team",
        select: "name title role email",
      })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const totalTasks = allTasksForCounting.length;

    const users = await User.find()
      .select("name title role email isAdmin isActive createdAt")
      .limit(10)
      .sort({ _id: -1 });

    // group task by priority
    const groupData = Object
      .entries(
        allTasksForCounting.reduce((result, task) => {
          const { priority } = task;
          result[priority] = (result[priority] || 0) + 1;
          return result;
        }, {})
      )
      .map(([name, total]) => ({ name, total }));

    const summary = {
      totalTask: totalTasks,
      tasks: allTasks,
      users: isAdmin ? users : [],
      tasksByStage: stageCounts,
      graphData: groupData,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
    };

    res.status(200).json({
      status: true,
      message: "Dashboard statistics fetched successfully.",
      ...summary,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    let query = {};
    if (projectId) {
      query.project = projectId;
    }
    // Add isTrashed filter if present in query params
    if (typeof req.query.isTrashed !== 'undefined') {
      query.isTrashed = req.query.isTrashed === 'true';
    }
    const { userID, isAdmin } = req.user;
    if (!isAdmin) {
      query.team = userID; // Only fetch tasks where the user is assigned
    }
    const tasks = await Task.find(query)
      .populate({
        path: "team",
        select: "name title role email",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      status: false,
      message: error.message || "Error fetching tasks",
    });
  }
};

export const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid task ID format. Task ID must be a valid MongoDB ObjectId",
      });
    }

    const task = await Task.findById(id)
      .populate({
        path: "createdBy",
        select: "name email",
        options: { strictPopulate: false } // This will prevent errors if createdBy doesn't exist
      })
      .populate("team", "name email");

    if (!task) {
      return res.status(404).json({
        status: false, 
        message: "Task not found",
      });
    }

    // Check if user has permission to view this task
    const hasPermission = await checkTaskPermission(req, task, 'view');
    if (!hasPermission) {
      return res.status(403).json({
        status: false,
        message: "You don't have permission to view this task"
      });
    }

    res.status(200).json({
      status: true,
      message: "Task fetched successfully",
      data: task,
    });
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({
      status: false,
      message: error.message || "Error fetching task",
    });
  }
};

export const createSubTask = async (req, res) => {
  try {
    const { title, date, tag } = req.body;
    const { id } = req.params;

    const newSubTask = {
      title,
      date,
      tag,
    };

    const task = await Task.findById(id);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { key, summary, status, assignee, dueDate } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        status: false, 
        message: "Task not found",
      });
    }

    // Update task fields
    task.key = key || task.key;
    task.summary = summary || task.summary;
    task.status = status || task.status;
    task.assignee = assignee || task.assignee;
    task.dueDate = dueDate || task.dueDate;

    await task.save();

    res.status(200).json({
      status: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      status: false,
      message: error.message || "Error updating task",
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      status: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      status: false,
      message: error.message || "Error deleting task",
    });
  }
};

export const trashTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    task.isTrashed = true;
    await task.save();
    res
      .status(200)
      .json({ status: true, message: "Task trashed successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteRestoreTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { actionType } = req.query;
    const { isAdmin, permissions } = req.user;

    if (actionType === "delete") {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ status: false, message: "Task not found" });
      }

      // Check if user has permission to delete this task
      const hasPermission = await checkTaskPermission(req, task, 'delete');
      if (!hasPermission) {
        return res.status(403).json({ 
          status: false, 
          message: "You don't have permission to delete this task" 
        });
      }

            await Task.findByIdAndDelete(id);
            return res.status(200).json({ status: true, message: "Task deleted successfully." });
    } else if (actionType === "deleteAll") {
      // Only admin can delete all tasks
      if (!isAdmin) {
        return res.status(403).json({ 
          status: false, 
          message: "Only administrators can delete all tasks" 
        });
      }
            await Task.deleteMany({ isTrashed: true });
            return res.status(200).json({ status: true, message: "All trashed tasks deleted successfully." });
    } else if (actionType === "restore") {
            const task = await Task.findById(id);
            if (!task) {
                return res.status(404).json({ status: false, message: "Task not found." });
            }

      // Check if user has permission to edit this task
      const hasPermission = await checkTaskPermission(req, task, 'edit');
      if (!hasPermission) {
        return res.status(403).json({ 
          status: false, 
          message: "You don't have permission to restore this task" 
        });
      }

            task.isTrashed = false;
            await task.save();
            return res.status(200).json({ status: true, message: "Task restored successfully." });
    } else if (actionType === "restoreAll") {
      // Only admin can restore all tasks
      if (!isAdmin) {
        return res.status(403).json({ 
          status: false, 
          message: "Only administrators can restore all tasks" 
        });
      }
            await Task.updateMany({ isTrashed: true }, { $set: { isTrashed: false } });
            return res.status(200).json({ status: true, message: "All trashed tasks restored successfully." });
        }

        return res.status(400).json({ status: false, message: "Invalid action type." });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const updateTaskTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, userId } = req.body;
    const { userID, isAdmin } = req.user;

    // Check if user is admin
    if (!isAdmin) {
      return res.status(403).json({ 
        status: false, 
        message: "Only administrators can modify team members" 
      });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ 
        status: false, 
        message: "Task not found" 
      });
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        status: false, 
        message: "User not found" 
      });
    }

    if (action === 'add') {
      // Check if user is already in the team
      if (task.team.includes(userId)) {
        return res.status(400).json({ 
          status: false, 
          message: "User is already in the team" 
        });
      }

      // Add user to team
      task.team.push(userId);

      // Add activity
      task.activities.push({
        type: "assigned",
        activity: `${user.name} has been added to the team`,
        date: new Date(),
        by: userID
      });

      // Create notification
      await Notice.create({
        team: [userId],
        text: `You have been added to the task: ${task.title}`,
        task: task._id
      });

    } else if (action === 'remove') {
      // Check if user is in the team
      if (!task.team.includes(userId)) {
        return res.status(400).json({ 
          status: false, 
          message: "User is not in the team" 
        });
      }

      // Remove user from team
      task.team = task.team.filter(id => id.toString() !== userId);

      // Add activity
      task.activities.push({
        type: "updated",
        activity: `${user.name} has been removed from the team`,
        date: new Date(),
        by: userID
      });

      // Create notification
      await Notice.create({
        team: [userId],
        text: `You have been removed from the task: ${task.title}`,
        task: task._id
      });

    } else {
      return res.status(400).json({ 
        status: false, 
        message: "Invalid action. Use 'add' or 'remove'" 
      });
    }

    await task.save();

    // Populate team information before sending response
    const populatedTask = await Task.findById(task._id)
      .populate({
        path: "team",
        select: "name title role email",
      });

    res.status(200).json({
      status: true,
      message: `Team member ${action === 'add' ? 'added' : 'removed'} successfully`,
      task: populatedTask
    });

  } catch (error) {
    console.error('Update task team error:', error);
    return res.status(400).json({ 
      status: false, 
      message: error.message 
    });
  }
};

// export const  = async (req, res) => {
//     try {
//     } catch (error) {
//         console.log(error);
//         return res.status(400).json({ status: false, message: error.message });
//     }
// };
