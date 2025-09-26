const Equipment = require('../models/equipmentModel');

class EquipmentController {
  // Get all equipment
  async getAllEquipment(req, res) {
    try {
      const { category, status, department, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      
      // Build query
      let query = {};
      
      if (category) {
        query.category = category;
      }
      
      if (status) {
        query.status = status;
      }
      
      if (department) {
        query.department = new RegExp(department, 'i');
      }
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { manufacturer: { $regex: search, $options: 'i' } },
          { model: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { serialNumber: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
      
      const equipment = await Equipment.find(query).sort(sort);
      
      res.status(200).json({
        success: true,
        data: equipment,
        count: equipment.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching equipment',
        error: error.message
      });
    }
  }

  // Get single equipment by ID
  async getEquipmentById(req, res) {
    try {
      const { id } = req.params;
      const equipment = await Equipment.findById(id);
      
      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: 'Equipment not found'
        });
      }

      res.status(200).json({
        success: true,
        data: equipment
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid equipment ID'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error fetching equipment',
        error: error.message
      });
    }
  }

  // Create new equipment
  async createEquipment(req, res) {
    try {
      const equipmentData = req.body;

      // Basic validation
      if (!equipmentData.name || !equipmentData.serialNumber || !equipmentData.category) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields: name, serialNumber, category'
        });
      }

      // Check if serial number already exists
      const existingEquipment = await Equipment.findOne({ serialNumber: equipmentData.serialNumber });
      if (existingEquipment) {
        return res.status(400).json({
          success: false,
          message: 'Equipment with this serial number already exists'
        });
      }

      const newEquipment = new Equipment(equipmentData);
      const savedEquipment = await newEquipment.save();

      res.status(201).json({
        success: true,
        data: savedEquipment,
        message: 'Equipment created successfully'
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
        message: 'Error creating equipment',
        error: error.message
      });
    }
  }

  // Update equipment
  async updateEquipment(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      // Handle date conversions
      if (updateData.purchaseDate) {
        updateData.purchaseDate = new Date(updateData.purchaseDate);
      }
      if (updateData.warrantyExpiry) {
        updateData.warrantyExpiry = new Date(updateData.warrantyExpiry);
      }
      if (updateData.lastMaintenanceDate) {
        updateData.lastMaintenanceDate = new Date(updateData.lastMaintenanceDate);
      }
      if (updateData.nextMaintenanceDate) {
        updateData.nextMaintenanceDate = new Date(updateData.nextMaintenanceDate);
      }

      const updatedEquipment = await Equipment.findByIdAndUpdate(
        id, 
        updateData, 
        { 
          new: true,
          runValidators: true
        }
      );

      if (!updatedEquipment) {
        return res.status(404).json({
          success: false,
          message: 'Equipment not found'
        });
      }

      res.status(200).json({
        success: true,
        data: updatedEquipment,
        message: 'Equipment updated successfully'
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid equipment ID'
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
        message: 'Error updating equipment',
        error: error.message
      });
    }
  }

  // Delete equipment
  async deleteEquipment(req, res) {
    try {
      const { id } = req.params;
      const deletedEquipment = await Equipment.findByIdAndDelete(id);

      if (!deletedEquipment) {
        return res.status(404).json({
          success: false,
          message: 'Equipment not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Equipment deleted successfully',
        data: deletedEquipment
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid equipment ID'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error deleting equipment',
        error: error.message
      });
    }
  }

  // Get equipment by category
  async getEquipmentByCategory(req, res) {
    try {
      const { category } = req.params;
      const equipment = await Equipment.findByCategory(category);
      
      res.status(200).json({
        success: true,
        data: equipment,
        count: equipment.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching equipment by category',
        error: error.message
      });
    }
  }

  // Get equipment by status
  async getEquipmentByStatus(req, res) {
    try {
      const { status } = req.params;
      const equipment = await Equipment.findByStatus(status);
      
      res.status(200).json({
        success: true,
        data: equipment,
        count: equipment.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching equipment by status',
        error: error.message
      });
    }
  }

  // Get maintenance due equipment
  async getMaintenanceDueEquipment(req, res) {
    try {
      const equipment = await Equipment.findMaintenanceDue();
      
      res.status(200).json({
        success: true,
        data: equipment,
        count: equipment.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching maintenance due equipment',
        error: error.message
      });
    }
  }

  // Get critical equipment
  async getCriticalEquipment(req, res) {
    try {
      const equipment = await Equipment.findCriticalEquipment();
      
      res.status(200).json({
        success: true,
        data: equipment,
        count: equipment.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching critical equipment',
        error: error.message
      });
    }
  }

  // Get equipment by department
  async getEquipmentByDepartment(req, res) {
    try {
      const { department } = req.params;
      const equipment = await Equipment.findByDepartment(department);
      
      res.status(200).json({
        success: true,
        data: equipment,
        count: equipment.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching equipment by department',
        error: error.message
      });
    }
  }

  // Search equipment
  async searchEquipment(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const equipment = await Equipment.searchEquipment(q);
      
      res.status(200).json({
        success: true,
        data: equipment,
        count: equipment.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error searching equipment',
        error: error.message
      });
    }
  }

  // Get dashboard stats
  async getDashboardStats(req, res) {
    try {
      const totalEquipment = await Equipment.countDocuments();
      const categories = await Equipment.distinct('category');
      const departments = await Equipment.distinct('department');
      const maintenanceDueEquipment = await Equipment.findMaintenanceDue();
      const criticalEquipment = await Equipment.findCriticalEquipment();
      
      // Status breakdown
      const statusBreakdown = await Equipment.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      
      // Category breakdown
      const categoryBreakdown = await Equipment.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalEquipment,
          totalCategories: categories.length,
          totalDepartments: departments.length,
          maintenanceDueCount: maintenanceDueEquipment.length,
          criticalCount: criticalEquipment.length,
          maintenanceDueEquipment,
          criticalEquipment,
          statusBreakdown,
          categoryBreakdown
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching dashboard stats',
        error: error.message
      });
    }
  }

  // Update equipment status
  async updateEquipmentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const validStatuses = ['Operational', 'Maintenance', 'Out of Service', 'Repair', 'Retired'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
        });
      }

      const updatedEquipment = await Equipment.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!updatedEquipment) {
        return res.status(404).json({
          success: false,
          message: 'Equipment not found'
        });
      }

      res.status(200).json({
        success: true,
        data: updatedEquipment,
        message: 'Equipment status updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating equipment status',
        error: error.message
      });
    }
  }
}

module.exports = new EquipmentController();
