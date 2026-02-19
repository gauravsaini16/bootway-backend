const Employee = require('../models/Employee');
const User = require('../models/User');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin/HR
exports.getEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find()
            .populate('user', 'fullName email avatar role phone')
            .populate('createdBy', 'fullName')
            .sort({ dateJoined: -1 });

        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private/Admin/HR
exports.getEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate('user', 'fullName email avatar role phone')
            .populate('createdBy', 'fullName');

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            data: employee
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin/HR
exports.updateEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('user', 'fullName email avatar role phone');

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            data: employee
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
exports.deleteEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Optionally revert user role to candidate
        if (employee.user) {
            await User.findByIdAndUpdate(employee.user, { role: 'candidate' });
        }

        await employee.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Employee removed'
        });
    } catch (err) {
        next(err);
    }
};
