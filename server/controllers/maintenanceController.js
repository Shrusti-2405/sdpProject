const Maintenance = require('../models/maintenanceModel');
const Equipment = require('../models/equipmentModel');

class MaintenanceController {
  // Get all maintenance records
  async getAllMaintenance(req, res) {
    try {
      const { status, type, priority, sortBy = 'scheduledDate', sortOrder = 'desc' } = req.query;
      
      // Build query
      let query = {};
      
      if (status) {
        query.status = status;
      }
      
      if (type) {
        query.type = type;
      }
      
      if (priority) {
        query.priority = priority;
      }
      
      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
      
      const maintenance = await Maintenance.find(query)
        .populate('equipmentId', 'name serialNumber category location department')
        .sort(sort);
      
      res.status(200).json({
        success: true,
        data: maintenance,
        count: maintenance.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching maintenance records',
        error: error.message
      });
    }
  }

  // Get single maintenance record by ID
  async getMaintenanceById(req, res) {
    try {
      const { id } = req.params;
      const maintenance = await Maintenance.findById(id)
        .populate('equipmentId', 'name serialNumber category location department manufacturer model');
      
      if (!maintenance) {
        return res.status(404).json({
          success: false,
          message: 'Maintenance record not found'
        });
      }

      res.status(200).json({
        success: true,
        data: maintenance
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid maintenance ID'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error fetching maintenance record',
        error: error.message
      });
    }
  }

  // Create new maintenance record
  async createMaintenance(req, res) {
    try {
      const maintenanceData = req.body;

      // Basic validation
      if (!maintenanceData.equipmentId || !maintenanceData.type || !maintenanceData.scheduledDate) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields: equipmentId, type, scheduledDate'
        });
      }

      // Verify equipment exists
      const equipment = await Equipment.findById(maintenanceData.equipmentId);
      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: 'Equipment not found'
        });
      }

      const newMaintenance = new Maintenance(maintenanceData);
      const savedMaintenance = await newMaintenance.save();

      // Populate equipment details
      await savedMaintenance.populate('equipmentId', 'name serialNumber category location department');

      res.status(201).json({
        success: true,
        data: savedMaintenance,
        message: 'Maintenance record created successfully'
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error creating maintenance record',
        error: error.message
      });
    }
  }

  // Update maintenance record
  async updateMaintenance(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      // Handle date conversions
      if (updateData.scheduledDate) {
        updateData.scheduledDate = new Date(updateData.scheduledDate);
      }
      if (updateData.completedDate) {
        updateData.completedDate = new Date(updateData.completedDate);
      }

      const updatedMaintenance = await Maintenance.findByIdAndUpdate(
        id, 
        updateData, 
        { 
          new: true,
          runValidators: true
        }
      ).populate('equipmentId', 'name serialNumber category location department');

      if (!updatedMaintenance) {
        return res.status(404).json({
          success: false,
          message: 'Maintenance record not found'
        });
      }

      res.status(200).json({
        success: true,
        data: updatedMaintenance,
        message: 'Maintenance record updated successfully'
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid maintenance ID'
        });
      }
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error updating maintenance record',
        error: error.message
      });
    }
  }

  // Delete maintenance record
  async deleteMaintenance(req, res) {
    try {
      const { id } = req.params;
      const deletedMaintenance = await Maintenance.findByIdAndDelete(id);

      if (!deletedMaintenance) {
        return res.status(404).json({
          success: false,
          message: 'Maintenance record not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Maintenance record deleted successfully',
        data: deletedMaintenance
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid maintenance ID'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error deleting maintenance record',
        error: error.message
      });
    }
  }

  // Get maintenance by equipment
  async getMaintenanceByEquipment(req, res) {
    try {
      const { equipmentId } = req.params;
      const maintenance = await Maintenance.findByEquipment(equipmentId)
        .populate('equipmentId', 'name serialNumber category location department');
      
      res.status(200).json({
        success: true,
        data: maintenance,
        count: maintenance.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching maintenance by equipment',
        error: error.message
      });
    }
  }

  // Get overdue maintenance
  async getOverdueMaintenance(req, res) {
    try {
      const maintenance = await Maintenance.findOverdue()
        .populate('equipmentId', 'name serialNumber category location department');
      
      res.status(200).json({
        success: true,
        data: maintenance,
        count: maintenance.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching overdue maintenance',
        error: error.message
      });
    }
  }

  // Get upcoming maintenance
  async getUpcomingMaintenance(req, res) {
    try {
      const { days = 7 } = req.query;
      const maintenance = await Maintenance.findUpcoming(parseInt(days))
        .populate('equipmentId', 'name serialNumber category location department');
      
      res.status(200).json({
        success: true,
        data: maintenance,
        count: maintenance.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching upcoming maintenance',
        error: error.message
      });
    }
  }

  // Get maintenance by technician
  async getMaintenanceByTechnician(req, res) {
    try {
      const { technicianId } = req.params;
      const maintenance = await Maintenance.findByTechnician(technicianId)
        .populate('equipmentId', 'name serialNumber category location department');
      
      res.status(200).json({
        success: true,
        data: maintenance,
        count: maintenance.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching maintenance by technician',
        error: error.message
      });
    }
  }

  // Complete maintenance
  async completeMaintenance(req, res) {
    try {
      const { id } = req.params;
      const { actualDuration, findings, actionsTaken, recommendations, partsUsed } = req.body;

      const updateData = {
        status: 'Completed',
        completedDate: new Date(),
        actualDuration,
        findings,
        actionsTaken,
        recommendations,
        partsUsed
      };

      const completedMaintenance = await Maintenance.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('equipmentId', 'name serialNumber category location department');

      if (!completedMaintenance) {
        return res.status(404).json({
          success: false,
          message: 'Maintenance record not found'
        });
      }

      res.status(200).json({
        success: true,
        data: completedMaintenance,
        message: 'Maintenance completed successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error completing maintenance',
        error: error.message
      });
    }
  }

  // Get maintenance statistics
  async getMaintenanceStats(req, res) {
    try {
      const stats = await Maintenance.getMaintenanceStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching maintenance statistics',
        error: error.message
      });
    }
  }

  // Schedule recurring maintenance
  async scheduleRecurringMaintenance(req, res) {
    try {
      const { equipmentId, type, description, technician, interval, priority = 'Medium' } = req.body;

      if (!equipmentId || !type || !description || !technician || !interval) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields: equipmentId, type, description, technician, interval'
        });
      }

      // Verify equipment exists
      const equipment = await Equipment.findById(equipmentId);
      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: 'Equipment not found'
        });
      }

      // Calculate next maintenance date
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + interval);

      const maintenanceData = {
        equipmentId,
        type,
        status: 'Scheduled',
        scheduledDate: nextDate,
        description,
        technician,
        priority,
        isRecurring: true,
        recurringInterval: interval
      };

      const newMaintenance = new Maintenance(maintenanceData);
      const savedMaintenance = await newMaintenance.save();

      await savedMaintenance.populate('equipmentId', 'name serialNumber category location department');

      res.status(201).json({
        success: true,
        data: savedMaintenance,
        message: 'Recurring maintenance scheduled successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error scheduling recurring maintenance',
        error: error.message
      });
    }
  }
}

module.exports = new MaintenanceController();
