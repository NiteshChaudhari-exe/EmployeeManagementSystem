import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide department name'],
      unique: true,
    },
    description: {
      type: String,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    employeeCount: {
      type: Number,
      default: 0,
    },
    budget: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Department', departmentSchema);
