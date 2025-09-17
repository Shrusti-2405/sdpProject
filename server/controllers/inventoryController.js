const inventoryModel = require('../models/inventoryModel');

class InventoryController {
  // Get all inventory items
  getAllItems(req, res) {
    try {
      const items = inventoryModel.getAllItems();
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
  getItemById(req, res) {
    try {
      const { id } = req.params;
      const item = inventoryModel.getItemById(id);
      
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
      res.status(500).json({
        success: false,
        message: 'Error fetching item',
        error: error.message
      });
    }
  }

  // Create new item
  createItem(req, res) {
    try {
      const { name, quantity, unit, category, expiryDate } = req.body;

      // Basic validation
      if (!name || !quantity || !unit || !category) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields: name, quantity, unit, category'
        });
      }

      const newItem = inventoryModel.createItem({
        name,
        quantity: parseFloat(quantity),
        unit,
        category,
        expiryDate
      });

      res.status(201).json({
        success: true,
        data: newItem,
        message: 'Item created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating item',
        error: error.message
      });
    }
  }

  // Update item
  updateItem(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Convert quantity to number if provided
      if (updateData.quantity) {
        updateData.quantity = parseFloat(updateData.quantity);
      }

      const updatedItem = inventoryModel.updateItem(id, updateData);

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
      res.status(500).json({
        success: false,
        message: 'Error updating item',
        error: error.message
      });
    }
  }

  // Delete item
  deleteItem(req, res) {
    try {
      const { id } = req.params;
      const deleted = inventoryModel.deleteItem(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Item deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting item',
        error: error.message
      });
    }
  }

  // Search items
  searchItems(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const items = inventoryModel.searchItems(q);
      
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
  getItemsByCategory(req, res) {
    try {
      const { category } = req.params;
      const items = inventoryModel.getItemsByCategory(category);
      
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
}

module.exports = new InventoryController();