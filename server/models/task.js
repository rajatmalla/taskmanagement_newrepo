import mongoose from "mongoose";
import { Schema } from "mongoose";
const taskSchema = new Schema({
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    description: { type: String },
    priority: { type: String, enum: ["low", "medium", "high"], default: "Low" },
    stage: {
      type: String,
      enum: ["todo", "in progress", "completed"],
      default: "todo",
    },
    tags: [{ type: String }],
    activities: [{
        type: {
            type: String,
      enum: [
        "assigned",
        "started",
        "in progress",
        "bug",
        "completed",
          "commented"
      ],
        default: "assigned"
     },
     activity: String,
      date: { type: Date, default: Date.now },
        by: {
          type: Schema.Types.ObjectId,
        ref: "User"
      }
    }],
    subTasks: [{
        type: String,
        date: Date,
        tag: String,
    },
    ],
    assets: [String],
    team: [{type: Schema. Types.ObjectId, ref: "User"}],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    isTrashed: { type: Boolean, default: false },
   
   
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
