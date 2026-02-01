import Employee from '../models/Employee.js';
import User from '../models/User.js';

// Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate('userId', 'email firstName lastName')
      .populate('department', 'name');
    
    res.json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single employee
export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('userId')
      .populate('department');
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create employee
export const createEmployee = async (req, res) => {
  try {
    const { userId, employeeId, position, department, salary, joinDate } = req.body;

    // Validation
    if (!userId || !employeeId || !position || !department || !salary) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const employee = await Employee.create({
      userId,
      employeeId,
      position,
      department,
      salary,
      joinDate,
    });

    res.status(201).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
