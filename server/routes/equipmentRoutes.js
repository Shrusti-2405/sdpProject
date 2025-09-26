const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');

// Equipment routes
router.get('/', equipmentController.getAllEquipment);
router.get('/stats', equipmentController.getDashboardStats);
router.get('/search', equipmentController.searchEquipment);
router.get('/category/:category', equipmentController.getEquipmentByCategory);
router.get('/status/:status', equipmentController.getEquipmentByStatus);
router.get('/department/:department', equipmentController.getEquipmentByDepartment);
router.get('/maintenance-due', equipmentController.getMaintenanceDueEquipment);
router.get('/critical', equipmentController.getCriticalEquipment);
router.get('/:id', equipmentController.getEquipmentById);
router.post('/', equipmentController.createEquipment);
router.put('/:id', equipmentController.updateEquipment);
router.put('/:id/status', equipmentController.updateEquipmentStatus);
router.delete('/:id', equipmentController.deleteEquipment);

module.exports = router;
