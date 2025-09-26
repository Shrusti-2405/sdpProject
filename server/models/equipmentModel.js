const mongoose = require('mongoose');

// Define the equipment schema
const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Diagnostic', 'Therapeutic', 'Surgical', 'Monitoring', 'Life Support', 
           'Imaging', 'Laboratory', 'Rehabilitation', 'Emergency', 'Other']
  },
  status: {
    type: String,
    required: true,
    enum: ['Operational', 'Maintenance', 'Out of Service', 'Repair', 'Retired'],
    default: 'Operational'
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  manufacturer: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  warrantyExpiry: {
    type: Date,
    default: null
  },
  lastMaintenanceDate: {
    type: Date,
    default: null
  },
  nextMaintenanceDate: {
    type: Date,
    default: null
  },
  maintenanceInterval: {
    type: Number,
    required: true,
    default: 30, // days
    min: 1
  },
  maintenanceHistory: [{
    date: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ['Preventive', 'Corrective', 'Emergency', 'Inspection'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    technician: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Completed', 'In Progress', 'Scheduled'],
      default: 'Completed'
    }
  }],
  criticality: {
    type: String,
    required: true,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Medium'
  },
  specifications: {
    type: Map,
    of: String
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Add indexes for better performance
equipmentSchema.index({ serialNumber: 1 });
equipmentSchema.index({ category: 1 });
equipmentSchema.index({ status: 1 });
equipmentSchema.index({ department: 1 });
equipmentSchema.index({ nextMaintenanceDate: 1 });
equipmentSchema.index({ criticality: 1 });

// Add text index for search functionality
equipmentSchema.index({ 
  name: 'text', 
  category: 'text',
  manufacturer: 'text',
  model: 'text',
  location: 'text'
});

// Instance methods
equipmentSchema.methods.isMaintenanceDue = function() {
  if (!this.nextMaintenanceDate) return false;
  return this.nextMaintenanceDate <= new Date();
};

equipmentSchema.methods.isMaintenanceOverdue = function() {
  if (!this.nextMaintenanceDate) return false;
  const overdueDate = new Date();
  overdueDate.setDate(overdueDate.getDate() - 7); // 7 days overdue
  return this.nextMaintenanceDate <= overdueDate;
};

equipmentSchema.methods.getDaysUntilMaintenance = function() {
  if (!this.nextMaintenanceDate) return null;
  const today = new Date();
  const diffTime = this.nextMaintenanceDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

equipmentSchema.methods.isWarrantyExpired = function() {
  if (!this.warrantyExpiry) return false;
  return this.warrantyExpiry < new Date();
};

equipmentSchema.methods.getWarrantyDaysRemaining = function() {
  if (!this.warrantyExpiry) return null;
  const today = new Date();
  const diffTime = this.warrantyExpiry - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Static methods
equipmentSchema.statics.findByCategory = function(category) {
  return this.find({ category: new RegExp(category, 'i') });
};

equipmentSchema.statics.findByStatus = function(status) {
  return this.find({ status: status });
};

equipmentSchema.statics.findMaintenanceDue = function() {
  return this.find({
    nextMaintenanceDate: { $lte: new Date() },
    status: { $ne: 'Retired' }
  });
};

equipmentSchema.statics.findCriticalEquipment = function() {
  return this.find({ 
    criticality: { $in: ['Critical', 'High'] },
    status: { $ne: 'Retired' }
  });
};

equipmentSchema.statics.findByDepartment = function(department) {
  return this.find({ department: new RegExp(department, 'i') });
};

equipmentSchema.statics.searchEquipment = function(query) {
  return this.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } },
      { manufacturer: { $regex: query, $options: 'i' } },
      { model: { $regex: query, $options: 'i' } },
      { location: { $regex: query, $options: 'i' } },
      { serialNumber: { $regex: query, $options: 'i' } }
    ]
  });
};

// Pre-save middleware to calculate next maintenance date
equipmentSchema.pre('save', function(next) {
  if (this.isModified('lastMaintenanceDate') || this.isModified('maintenanceInterval')) {
    if (this.lastMaintenanceDate) {
      const nextDate = new Date(this.lastMaintenanceDate);
      nextDate.setDate(nextDate.getDate() + this.maintenanceInterval);
      this.nextMaintenanceDate = nextDate;
    }
  }
  next();
});

// Create and export the model
const Equipment = mongoose.model('Equipment', equipmentSchema);

// Seed some initial data if the collection is empty
const seedInitialData = async () => {
  try {
    const count = await Equipment.countDocuments();
    console.log('Current equipment count:', count);
    
    // Always add sample data for demo
    const initialEquipment = [
      {
        name: 'MRI Scanner',
        serialNumber: 'MRI-001-2024',
        category: 'Imaging',
        status: 'Operational',
        location: 'Radiology Department',
        department: 'Radiology',
        manufacturer: 'Siemens',
        model: 'Magnetom Skyra 3T',
        purchaseDate: new Date('2023-01-15'),
        warrantyExpiry: new Date('2026-01-15'),
        lastMaintenanceDate: new Date('2024-01-15'),
        nextMaintenanceDate: new Date('2024-04-15'),
        maintenanceInterval: 90,
        criticality: 'Critical',
        specifications: {
          'Field Strength': '3 Tesla',
          'Patient Weight Limit': '200 kg',
          'Room Requirements': 'Shielded Room'
        },
        notes: 'Primary MRI scanner for diagnostic imaging',
        maintenanceHistory: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Ventilator',
        serialNumber: 'VENT-002-2024',
        category: 'Life Support',
        status: 'Operational',
        location: 'ICU Room 1',
        department: 'ICU',
        manufacturer: 'Medtronic',
        model: 'PB980',
        purchaseDate: new Date('2023-03-20'),
        warrantyExpiry: new Date('2025-03-20'),
        lastMaintenanceDate: new Date('2024-01-20'),
        nextMaintenanceDate: new Date('2024-02-20'),
        maintenanceInterval: 30,
        criticality: 'Critical',
        specifications: {
          'Modes': 'Volume, Pressure, SIMV',
          'Flow Range': '2-120 L/min',
          'Pressure Range': '0-120 cmH2O'
        },
        notes: 'Critical life support equipment',
        maintenanceHistory: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'X-Ray Machine',
        serialNumber: 'XR-003-2024',
        category: 'Imaging',
        status: 'Maintenance',
        location: 'Emergency Department',
        department: 'Emergency',
        manufacturer: 'GE Healthcare',
        model: 'Definium 8000',
        purchaseDate: new Date('2022-08-10'),
        warrantyExpiry: new Date('2024-08-10'),
        lastMaintenanceDate: new Date('2024-01-10'),
        nextMaintenanceDate: new Date('2024-03-10'),
        maintenanceInterval: 60,
        criticality: 'High',
        specifications: {
          'Power': '80 kW',
          'Tube Current': '800 mA',
          'Exposure Time': '0.001-10 s'
        },
        notes: 'Digital radiography system',
        maintenanceHistory: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Defibrillator',
        serialNumber: 'DEF-004-2024',
        category: 'Emergency',
        status: 'Operational',
        location: 'Emergency Room',
        department: 'Emergency',
        manufacturer: 'Philips',
        model: 'HeartStart MRx',
        purchaseDate: new Date('2023-06-15'),
        warrantyExpiry: new Date('2026-06-15'),
        lastMaintenanceDate: new Date('2024-01-15'),
        nextMaintenanceDate: new Date('2024-02-15'),
        maintenanceInterval: 30,
        criticality: 'Critical',
        specifications: {
          'Energy Range': '1-360 J',
          'Waveform': 'Biphasic',
          'Battery Life': '8 hours'
        },
        notes: 'Automated external defibrillator',
        maintenanceHistory: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Ultrasound Machine',
        serialNumber: 'US-005-2024',
        category: 'Diagnostic',
        status: 'Operational',
        location: 'Cardiology Department',
        department: 'Cardiology',
        manufacturer: 'Philips',
        model: 'EPIQ 7',
        purchaseDate: new Date('2023-09-05'),
        warrantyExpiry: new Date('2026-09-05'),
        lastMaintenanceDate: new Date('2024-01-05'),
        nextMaintenanceDate: new Date('2024-02-20'),
        maintenanceInterval: 45,
        criticality: 'High',
        specifications: {
          'Transducers': '4',
          'Frequency Range': '1-15 MHz',
          'Display': '21 inch LED'
        },
        notes: 'Advanced cardiac ultrasound system',
        maintenanceHistory: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Clear existing data and insert new data
    await Equipment.deleteMany({});
    await Equipment.insertMany(initialEquipment);
    console.log('✅ Sample equipment data inserted successfully!');
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
};

// Call seed function
seedInitialData();

module.exports = Equipment;
