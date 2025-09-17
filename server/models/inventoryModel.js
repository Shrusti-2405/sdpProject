const { v4: uuidv4 } = require('uuid');

class InventoryModel {
  constructor() {
    // In-memory storage (replace with database in production)
    this.items = [
      {
        id: uuidv4(),
        name: 'Tomatoes',
        quantity: 5,
        unit: 'pieces',
        category: 'Vegetables',
        expiryDate: '2024-01-15',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Rice',
        quantity: 2,
        unit: 'kg',
        category: 'Grains',
        expiryDate: '2024-06-01',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Chicken Breast',
        quantity: 1,
        unit: 'kg',
        category: 'Protein',
        expiryDate: '2024-01-10',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  // Get all items
  getAllItems() {
    return this.items;
  }

  // Get item by ID
  getItemById(id) {
    return this.items.find(item => item.id === id);
  }

  // Create new item
  createItem(itemData) {
    const newItem = {
      id: uuidv4(),
      name: itemData.name,
      quantity: itemData.quantity,
      unit: itemData.unit,
      category: itemData.category,
      expiryDate: itemData.expiryDate,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.items.push(newItem);
    return newItem;
  }

  // Update item
  updateItem(id, updateData) {
    const itemIndex = this.items.findIndex(item => item.id === id);
    if (itemIndex === -1) return null;

    const updatedItem = {
      ...this.items[itemIndex],
      ...updateData,
      updatedAt: new Date()
    };

    this.items[itemIndex] = updatedItem;
    return updatedItem;
  }

  // Delete item
  deleteItem(id) {
    const itemIndex = this.items.findIndex(item => item.id === id);
    if (itemIndex === -1) return false;

    this.items.splice(itemIndex, 1);
    return true;
  }

  // Get items by category
  getItemsByCategory(category) {
    return this.items.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Search items
  searchItems(query) {
    return this.items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
  }
}

module.exports = new InventoryModel();