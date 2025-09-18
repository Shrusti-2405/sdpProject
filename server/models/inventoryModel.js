const mongoose = require('mongoose');

// Define the inventory item schema
const inventoryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['pieces', 'kg', 'grams', 'liters', 'ml', 'cups', 'tbsp', 'tsp', 'packets', 'bottles']
  },
  category: {
    type: String,
    required: true,
    enum: ['Vegetables', 'Fruits', 'Grains', 'Protein', 'Dairy', 'Spices', 'Condiments', 
           'Beverages', 'Snacks', 'Frozen', 'Canned', 'Bakery', 'Other']
  },
  expiryDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Add indexes for better performance
inventoryItemSchema.index({ name: 1 });
inventoryItemSchema.index({ category: 1 });
inventoryItemSchema.index({ expiryDate: 1 });

// Add text index for search functionality
inventoryItemSchema.index({ 
  name: 'text', 
  category: 'text' 
});

// Instance methods
inventoryItemSchema.methods.isExpired = function() {
  if (!this.expiryDate) return false;
  return this.expiryDate < new Date();
};

inventoryItemSchema.methods.isExpiringSoon = function(days = 3) {
  if (!this.expiryDate) return false;
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + days);
  return this.expiryDate <= threeDaysFromNow && this.expiryDate >= new Date();
};

inventoryItemSchema.methods.isLowStock = function(threshold = 2) {
  return this.quantity <= threshold;
};

// Static methods
inventoryItemSchema.statics.findByCategory = function(category) {
  return this.find({ category: new RegExp(category, 'i') });
};

inventoryItemSchema.statics.findExpiringSoon = function(days = 3) {
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + days);
  return this.find({
    expiryDate: {
      $lte: threeDaysFromNow,
      $gte: new Date()
    }
  });
};

inventoryItemSchema.statics.findLowStock = function(threshold = 2) {
  return this.find({ quantity: { $lte: threshold } });
};

inventoryItemSchema.statics.searchItems = function(query) {
  return this.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } }
    ]
  });
};

// Create and export the model
const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

// Seed some initial data if the collection is empty
const seedInitialData = async () => {
  try {
    const count = await InventoryItem.countDocuments();
    if (count === 0) {
      const initialItems = [
        {
          name: 'Tomatoes',
          quantity: 5,
          unit: 'pieces',
          category: 'Vegetables',
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        },
        {
          name: 'Rice',
          quantity: 2,
          unit: 'kg',
          category: 'Grains',
          expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 6 months from now
        },
        {
          name: 'Chicken Breast',
          quantity: 1,
          unit: 'kg',
          category: 'Protein',
          expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
        },
        {
          name: 'Milk',
          quantity: 1,
          unit: 'liters',
          category: 'Dairy',
          expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
        },
        {
          name: 'Onions',
          quantity: 3,
          unit: 'pieces',
          category: 'Vegetables',
          expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks from now
        }
      ];
      
      await InventoryItem.insertMany(initialItems);
      console.log('Initial inventory data seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
};

// Call seed function
seedInitialData();

module.exports = InventoryItem;