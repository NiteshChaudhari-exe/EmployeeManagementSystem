import Payroll from '../models/Payroll.js';

// Get all payroll records
export const getAllPayroll = async (req, res) => {
  try {
    const payroll = await Payroll.find()
      .populate('employee', 'employeeId position salary');
    
    res.json({
      success: true,
      count: payroll.length,
      data: payroll,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single payroll record
export const getPayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate('employee', 'employeeId position salary');
    
    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll record not found',
      });
    }

    res.json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create payroll record
export const createPayroll = async (req, res) => {
  try {
    const { employee, month, baseSalary, bonus, deductions, netSalary } = req.body;

    if (!employee || !month || !baseSalary || !netSalary) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const payroll = await Payroll.create({
      employee,
      month,
      baseSalary,
      bonus,
      deductions,
      netSalary,
    });

    res.status(201).json({
      success: true,
      data: payroll,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update payroll record
export const updatePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll record not found',
      });
    }

    res.json({ success: true, data: payroll });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete payroll record
export const deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll record not found',
      });
    }

    res.json({
      success: true,
      message: 'Payroll record deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate payroll for multiple employees
export const generatePayroll = async (req, res) => {
  try {
    const { month, employees } = req.body;

    if (!month || !employees || employees.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide month and employee list',
      });
    }

    // This would typically call a calculation service
    res.status(201).json({
      success: true,
      message: 'Payroll generated successfully',
      count: employees.length,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
