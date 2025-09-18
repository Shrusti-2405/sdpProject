const InventoryItem = require('../models/inventoryModel');

class InventoryController {
  // Get all inventory items
  async getAllItems(req, res) {
    try {
      const { category, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      
      // Build query
      let query = {};
      
      if (category) {
        query.category = category;
      }
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
      
      const items = await InventoryItem.find(query).sort(sort);
      
      res.status(200).json({
        success: true,
        data: items,
        count: items.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching inventory items',
        error: error.message
      });
    }
  }

  // Get single item by ID
  async getItemById(req, res) {
    try {
      const { id } = req.params;
      const item = await InventoryItem.findById(id);
      
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        });
      }

      res.status(200).json({
        success: true,
        data: item
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid item ID'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error fetching item',
        error: error.message
      });
    }
  }

  // Create new item
  async createItem(req, res) {
    try {
      const { name, quantity, unit, category, expiryDate } = req.body;

      // Basic validation
      if (!name || !quantity || !unit || !category) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields: name, quantity, unit, category'
        });
      }

      const newItem = new InventoryItem({
        name: name.trim(),
        quantity: parseFloat(quantity),
        unit,
        category,
        expiryDate: expiryDate ? new Date(expiryDate) : null
      });

      const savedItem = await newItem.save();

      res.status(201).json({
        success: true,
        data: savedItem,
        message: 'Item created successfully'
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
        message: 'Error creating item',
        error: error.message
      });
    }
  }

  // Update item
  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      // Convert quantity to number if provided
      if (updateData.quantity) {
        updateData.quantity = parseFloat(updateData.quantity);
      }

      // Convert expiryDate if provided
      if (updateData.expiryDate) {
        updateData.expiryDate = new Date(updateData.expiryDate);
      }

      // Trim name if provided
      if (updateData.name) {
        updateData.name = updateData.name.trim();
      }

      const updatedItem = await InventoryItem.findByIdAndUpdate(
        id, 
        updateData, 
        { 
          new: true, // Return the updated document
          runValidators: true // Run schema validators
        }
      );

      if (!updatedItem) {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        });
      }

      res.status(200).json({
        success: true,
        data: updatedItem,
        message: 'Item updated successfully'
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid item ID'
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
        message: 'Error updating item',
        error: error.message
      });
    }
  }

  // Delete item
  async deleteItem(req, res) {
    try {
      const { id } = req.params;
      const deletedItem = await InventoryItem.findByIdAndDelete(id);

      if (!deletedItem) {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Item deleted successfully',
        data: deletedItem
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid item ID'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error deleting item',
        error: error.message
      });
    }
  }

  // Search items
  async searchItems(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const items = await InventoryItem.searchItems(q);
      
      res.status(200).json({
        success: true,
        data: items,
        count: items.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error searching items',
        error: error.message
      });
    }
  }

  // Get items by category
  async getItemsByCategory(req, res) {
    try {
      const { category } = req.params;
      const items = await InventoryItem.findByCategory(category);
      
      res.status(200).json({
        success: true,
        data: items,
        count: items.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching items by category',
        error: error.message
      });
    }
  }

  // Get dashboard stats
  async getDashboardStats(req, res) {
    try {
      const totalItems = await InventoryItem.countDocuments();
      const categories = await InventoryItem.distinct('category');
      const lowStockItems = await InventoryItem.findLowStock();
      const expiringSoonItems = await InventoryItem.findExpiringSoon();
      
      res.status(200).json({
        success: true,
        data: {
          totalItems,
          totalCategories: categories.length,
          lowStockCount: lowStockItems.length,
          expiringSoonCount: expiringSoonItems.length,
          lowStockItems,
          expiringSoonItems
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
}

module.exports = new InventoryController();