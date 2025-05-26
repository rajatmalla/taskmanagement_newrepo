import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: function() {
        return !this.googleId; // Password is only required if not using Google OAuth
      },
      minlength: 6,
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'user'],
      default: 'user',
      required: true
    },
    permissions: {
      canViewAllTasks: {
        type: Boolean,
        default: false
      },
      canCreateTasks: {
        type: Boolean,
        default: true
      },
      canEditAllTasks: {
        type: Boolean,
        default: false
      },
      canDeleteTasks: {
        type: Boolean,
        default: false
      },
      canAssignTasks: {
        type: Boolean,
        default: false
      },
      canViewAllProjects: {
        type: Boolean,
        default: false
      },
      canCreateProjects: {
        type: Boolean,
        default: false
      },
      canAddTeamMember: {
        type: Boolean,
        default: false
      },
      canEditAllProjects: {
        type: Boolean,
        default: false
      },
      canDeleteProjects: {
        type: Boolean,
        default: false
      },
      canAssignProjects: {
        type: Boolean,
        default: false
      }
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
  },
    requiresPasswordSetup: {
      type: Boolean,
      default: false
    },
    tasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    }]
  },
  {
    timestamps: true,
  }
);

// Modify the password validation to allow null passwords for Google OAuth users
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.password === null) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update the matchPassword method to handle null passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Set default permissions based on role
userSchema.pre('save', function(next) {
  if (this.isModified('role') || this.isModified('isAdmin')) {
    // If user is admin, set all permissions to true
    if (this.isAdmin) {
      this.role = 'admin';
      this.permissions = {
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
    } else {
      // Set permissions based on role for non-admin users
      switch(this.role) {
        case 'manager':
          this.permissions = {
            canViewAllTasks: true,
            canCreateTasks: true,
            canEditAllTasks: true,
            canDeleteTasks: false,
            canAssignTasks: true
          };
          break;
        case 'user':
          this.permissions = {
            canViewAllTasks: false,
            canCreateTasks: true,
            canEditAllTasks: false,
            canDeleteTasks: false,
            canAssignTasks: false
          };
          break;
        default:
          this.permissions = {
            canViewAllTasks: false,
            canCreateTasks: true,
            canEditAllTasks: false,
            canDeleteTasks: false,
            canAssignTasks: false
          };
      }
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
