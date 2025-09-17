const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// GET /api/inventory - Get all items
router.get('/', inventoryController.getAllItems);

// GET /api/inventory/search?q=query - Search items
router.get('/search', inventoryController.searchItems);

// GET /api/inventory/category/:category - Get items by category
router.get('/category/:category', inventoryController.getItemsByCategory);

// GET /api/inventory/:id - Get single item
router.get('/:id', inventoryController.getItemById);

// POST /api/inventory - Create new item
router.post('/', inventoryController.createItem);

// PUT /api/inventory/:id - Update item
router.put('/:id', inventoryController.updateItem);

// DELETE /api/inventory/:id - Delete item
router.delete('/:id', inventoryController.deleteItem);

module.exports = router;