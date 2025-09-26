const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

// Maintenance routes
router.get('/', maintenanceController.getAllMaintenance);
router.get('/stats', maintenanceController.getMaintenanceStats);
router.get('/overdue', maintenanceController.getOverdueMaintenance);
router.get('/upcoming', maintenanceController.getUpcomingMaintenance);
router.get('/equipment/:equipmentId', maintenanceController.getMaintenanceByEquipment);
router.get('/technician/:technicianId', maintenanceController.getMaintenanceByTechnician);
router.get('/:id', maintenanceController.getMaintenanceById);
router.post('/', maintenanceController.createMaintenance);
router.post('/recurring', maintenanceController.scheduleRecurringMaintenance);
router.put('/:id', maintenanceController.updateMaintenance);
router.put('/:id/complete', maintenanceController.completeMaintenance);
router.delete('/:id', maintenanceController.deleteMaintenance);

module.exports = router;
