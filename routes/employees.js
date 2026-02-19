const express = require('express');
const router = express.Router();
const {
    getEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeeController');

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);
router.use(authorize('admin', 'hr'));

router
    .route('/')
    .get(getEmployees);

router
    .route('/:id')
    .get(getEmployee)
    .put(updateEmployee)
    .delete(deleteEmployee);

module.exports = router;
