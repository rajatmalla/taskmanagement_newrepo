import { response } from "express";
import User from "../models/User.js";
import { createJWT } from "../utils/index.js";
import Notice from "../models/notification.js";

export const registerUser = async (req, res) => {
  try {
    console.log('=== Registration Debug ===');
    console.log('Request body:', req.body);
    
    const { name, title, role, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        status: false, 
        message: "Please provide all required fields: name, email, and password" 
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format');
      return res.status(400).json({
        status: false,
        message: "Please provide a valid email address"
      });
    }

    // Validate password length
    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ 
        status: false, 
        message: "Password must be at least 6 characters long"
      });
    }

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      console.log('User already exists');
      return res.status(400).json({ 
        status: false, 
        message: "User with this email already exists" 
      });
    }

    // Create new user with default values
    const user = await User.create({
      name,
      title: title || "Team Member",
      role: role || "user",
      email,
      password,
      isAdmin: false,
      isActive: true,
      permissions: {
        canViewAllTasks: false,
        canCreateTasks: true,
        canEditAllTasks: false,
        canDeleteTasks: false,
        canAssignTasks: false,
        canViewAllProjects: false,
        canCreateProjects: false,
        canAddTeamMember: false,
        canEditAllProjects: false,
        canDeleteProjects: false,
        canAssignProjects: false
      }
    });

    if (user) {
      console.log('User created successfully');
      // If user is admin, update permissions
      if (user.isAdmin) {
        user.permissions = {
          canViewAllTasks: true,
          canCreateTasks: true,
          canEditAllTasks: true,
          canDeleteTasks: true,
          canAssignTasks: true,
          canViewAllProjects: true,
          canCreateProjects: true,
          canAddTeamMember: true,
          canEditAllProjects: true,
          canDeleteProjects: true,
          canAssignProjects: true
        };
        await user.save();
      }
      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json({
        status: true,
        message: "User created successfully",
        user: userResponse
      });
    } else {
      console.log('Failed to create user');
      return res.status(400).json({ 
        status: false, 
        message: "Failed to create user" 
      });
    }
  } catch (error) {
    console.error('User registration error:', error);
    return res.status(400).json({ 
      status: false, 
      message: error.message || "An error occurred during registration" 
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('=== Login Debug ===');
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ 
        status: false, 
        message: "Please provide both email and password" 
      });
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({ 
        status: false, 
        message: "Invalid email or password" 
      });
    }

    if (!user.isActive) {
      console.log('User account is deactivated');
      return res.status(401).json({
        status: false,
        message: "User account has been deactivated, contact the administrator",
      });
    }

    try {
    const isMatch = await user.matchPassword(password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');

    if (user && isMatch) {
      try {
        const token = createJWT(res, user._id);
        console.log('JWT token created');
        
          // Remove password from user object
          const userResponse = user.toObject();
          delete userResponse.password;
          
        const response = {
          status: true,
          message: "Login successful",
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            title: user.title,
            isAdmin: user.isAdmin,
              isActive: user.isActive,
              permissions: user.permissions
          },
          token
        };
        
        console.log('Login response:', response);
        res.status(200).json(response);
      } catch (jwtError) {
        console.error('JWT creation error:', jwtError);
        return res.status(500).json({
          status: false,
          message: "Error creating authentication token"
        });
      }
    } else {
      console.log('Invalid credentials');
      return res.status(401).json({ 
        status: false, 
        message: "Invalid email or password" 
        });
      }
    } catch (passwordError) {
      console.error('Password comparison error:', passwordError);
      return res.status(500).json({
        status: false,
        message: "Error verifying password"
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      status: false, 
      message: "Internal server error during login",
      error: error.message 
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      expires: new Date(0),
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTeamList = async (req, res) => {
  try {
    const user = await User.find().select("name title role email isActive");

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getNotificationsList = async (req, res) => {
  try {
    const { userID } = req.user;
    const notice = await Notice.find({
      team: userID,
    }).populate("task", "title");

    res.status(200).json(notice);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userID, isAdmin } = req.user;
    const { _id, name, title, role, isActive, email } = req.body;

    const id =
      isAdmin && userID === _id
        ? userID
        : isAdmin && userID !== _id
        ? _id
        : userID;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    user.name = name ?? user.name;
    user.title = title ?? user.title;
    user.role = role ?? user.role;
    user.isActive = isActive ?? user.isActive;
    user.email = email ?? user.email;

    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).json({
      status: true,
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, ...updateData } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Update user fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        user[key] = updateData[key];
      }
    });

    // Update isActive status if provided
    if (isActive !== undefined) {
      user.isActive = isActive;
    }

    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).json({
      status: true,
      message: `User ${updatedUser.isActive ? "activated" : "disabled"} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { userID } = req.user;
    const { isReadType, id } = req.body;

    console.log('=== Mark Notification Read Debug ===');
    console.log('User ID:', userID);
    console.log('Read Type:', isReadType);
    console.log('Notification ID:', id);

    if (isReadType === "all") {
      // Mark all unread notifications as read
      const result = await Notice.updateMany(
        { 
          team: userID, 
          isRead: { $nin: [userID] } 
        },
        { 
          $addToSet: { isRead: userID } 
        }
      );
      
      console.log('Update result:', result);
      
      return res.status(200).json({
        status: true,
        message: "All notifications marked as read",
        updatedCount: result.modifiedCount
      });
    } 
    
    if (id) {
      // Mark single notification as read
      const result = await Notice.findOneAndUpdate(
        { 
          _id: id,
          team: userID,
          isRead: { $nin: [userID] }
        },
        { 
          $addToSet: { isRead: userID } 
        },
        { new: true }
      );

      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Notification not found or already read"
        });
      }

      return res.status(200).json({
      status: true,
      message: "Notification marked as read",
        notification: result
      });
    }

    return res.status(400).json({
      status: false,
      message: "Invalid request. Either isReadType=all or id is required"
    });

  } catch (error) {
    console.error('Mark notification read error:', error);
    return res.status(400).json({ 
      status: false, 
      message: error.message 
    });
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const { userID } = req.user;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(userID).select('+password');

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ status: false, message: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();
    user.password = undefined;

    res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const activateUserProfile = async (req, res) => {
  try {
    const { userID } = req.user;
    const user = await User.findById(userID);

    if (user) {
      user.isActive = req.body.isActive;
      await user.save();

      res.status(201).json({
        status: true,
        message: `User profile activated successfully,${
          user?.isActive ? "activated" : "disabled"
        }`,
      });
    } else {
      return res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.status(200).json({ status: true, message: "User profile deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getUserStatus = async (req, res) => {
  try {
    const { userID, isAdmin } = req.user;

    // If admin, get all users with their tasks
    if (isAdmin) {
      const users = await User.find()
        .select("name title role email isActive isAdmin")
        .populate({
          path: "tasks",
          select: "title stage priority",
          match: { isTrashed: false }
        });

      // Calculate task statistics for each user
      const usersWithStats = users.map(user => {
        const taskStats = {
          total: user.tasks.length,
          inProgress: user.tasks.filter(task => task.stage === "in progress").length,
          todo: user.tasks.filter(task => task.stage === "todo").length,
          completed: user.tasks.filter(task => task.stage === "completed").length
        };

        return {
          ...user.toObject(),
          taskStats
        };
      });

      return res.status(200).json({
        status: true,
        users: usersWithStats
      });
    }

    // For regular users, get only their tasks
    const user = await User.findById(userID)
      .select("name title role email isActive isAdmin")
      .populate({
        path: "tasks",
        select: "title stage priority",
        match: { isTrashed: false }
      });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Calculate task statistics for the user
    const taskStats = {
      total: user.tasks.length,
      inProgress: user.tasks.filter(task => task.stage === "in progress").length,
      todo: user.tasks.filter(task => task.stage === "todo").length,
      completed: user.tasks.filter(task => task.stage === "completed").length
    };

    res.status(200).json({
      status: true,
      user: {
        ...user.toObject(),
        taskStats
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { userID } = req.user;
    const { id } = req.params;

    if (id === "all") {
      // Delete all notifications for the user
      await Notice.deleteMany({ team: userID });
      return res.status(200).json({
        status: true,
        message: "All notifications deleted successfully"
      });
    }

    // Delete specific notification
    const result = await Notice.findOneAndDelete({
      _id: id,
      team: userID
    });

    if (!result) {
      return res.status(404).json({
        status: false,
        message: "Notification not found"
      });
    }

    return res.status(200).json({
      status: true,
      message: "Notification deleted successfully"
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    return res.status(400).json({ 
      status: false, 
      message: error.message 
    });
  }
};
