import Department from '../models/Department.js';

// Get all departments
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('manager', 'email firstName lastName');
    
    res.json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single department
export const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('manager', 'email firstName lastName');
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    res.json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create department
export const createDepartment = async (req, res) => {
  try {
    const { name, description, manager, budget } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide department name',
      });
    }

    const department = await Department.create({
      name,
      description,
      manager,
      budget,
    });

    res.status(201).json({
      success: true,
      data: department,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update department
export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    res.json({ success: true, data: department });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete department
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    res.json({
      success: true,
      message: 'Department deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
