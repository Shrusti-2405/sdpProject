const mongoose = require('mongoose');

// Define the maintenance record schema
const maintenanceSchema = new mongoose.Schema({
  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Preventive', 'Corrective', 'Emergency', 'Inspection', 'Calibration']
  },
  status: {
    type: String,
    required: true,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Overdue'],
    default: 'Scheduled'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  completedDate: {
    type: Date,
    default: null
  },
  description: {
    type: String,
    required: true
  },
  technician: {
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    }
  },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  estimatedDuration: {
    type: Number, // in hours
    required: true,
    default: 2
  },
  actualDuration: {
    type: Number, // in hours
    default: null
  },
  cost: {
    type: Number,
    default: 0,
    min: 0
  },
  partsUsed: [{
    name: {
      type: String,
      required: true
    },
    partNumber: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    cost: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  findings: {
    type: String,
    default: ''
  },
  actionsTaken: {
    type: String,
    default: ''
  },
  recommendations: {
    type: String,
    default: ''
  },
  nextMaintenanceDate: {
    type: Date,
    default: null
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String
  }],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringInterval: {
    type: Number, // in days
    default: null
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Add indexes for better performance
maintenanceSchema.index({ equipmentId: 1 });
maintenanceSchema.index({ status: 1 });
maintenanceSchema.index({ scheduledDate: 1 });
maintenanceSchema.index({ type: 1 });
maintenanceSchema.index({ priority: 1 });
maintenanceSchema.index({ 'technician.id': 1 });

// Instance methods
maintenanceSchema.methods.isOverdue = function() {
  return this.status === 'Scheduled' && this.scheduledDate < new Date();
};

maintenanceSchema.methods.getDaysUntilScheduled = function() {
  const today = new Date();
  const diffTime = this.scheduledDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

maintenanceSchema.methods.isCompleted = function() {
  return this.status === 'Completed';
};

maintenanceSchema.methods.getTotalCost = function() {
  let totalCost = this.cost || 0;
  if (this.partsUsed && this.partsUsed.length > 0) {
    totalCost += this.partsUsed.reduce((sum, part) => sum + (part.cost * part.quantity), 0);
  }
  return totalCost;
};

// Static methods
maintenanceSchema.statics.findByEquipment = function(equipmentId) {
  return this.find({ equipmentId }).sort({ scheduledDate: -1 });
};

maintenanceSchema.statics.findOverdue = function() {
  return this.find({
    status: 'Scheduled',
    scheduledDate: { $lt: new Date() }
  });
};

maintenanceSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

maintenanceSchema.statics.findByTechnician = function(technicianId) {
  return this.find({ 'technician.id': technicianId });
};

maintenanceSchema.statics.findUpcoming = function(days = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    status: 'Scheduled',
    scheduledDate: { $lte: futureDate, $gte: new Date() }
  });
};

maintenanceSchema.statics.getMaintenanceStats = async function() {
  const total = await this.countDocuments();
  const completed = await this.countDocuments({ status: 'Completed' });
  const scheduled = await this.countDocuments({ status: 'Scheduled' });
  const overdue = await this.countDocuments({
    status: 'Scheduled',
    scheduledDate: { $lt: new Date() }
  });
  const inProgress = await this.countDocuments({ status: 'In Progress' });

  return {
    total,
    completed,
    scheduled,
    overdue,
    inProgress,
    completionRate: total > 0 ? (completed / total) * 100 : 0
  };
};

// Pre-save middleware to update equipment status
maintenanceSchema.pre('save', async function(next) {
  if (this.isModified('status') && this.status === 'Completed') {
    this.completedDate = new Date();
    
    // Update equipment's last maintenance date
    const Equipment = mongoose.model('Equipment');
    await Equipment.findByIdAndUpdate(this.equipmentId, {
      lastMaintenanceDate: this.completedDate
    });
  }
  next();
});

// Create and export the model
const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

// Seed sample maintenance data
const seedMaintenanceData = async () => {
  try {
    const Equipment = require('./equipmentModel');
    const equipment = await Equipment.find();
    
    if (equipment.length > 0) {
      await Maintenance.deleteMany({});
      
      const sampleMaintenance = [
        {
          equipmentId: equipment[0]._id,
          type: 'Preventive',
          status: 'Scheduled',
          scheduledDate: new Date('2024-02-15'),
          description: 'Monthly preventive maintenance check',
          technician: {
            name: 'John Smith',
            id: 'TECH001',
            contact: 'john.smith@hospital.com'
          },
          priority: 'Medium',
          estimatedDuration: 2,
          cost: 150.00,
          partsUsed: [],
          findings: '',
          actionsTaken: '',
          recommendations: '',
          isRecurring: true,
          recurringInterval: 30,
          notes: 'Regular maintenance schedule',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          equipmentId: equipment[1]._id,
          type: 'Corrective',
          status: 'Completed',
          scheduledDate: new Date('2024-01-20'),
          completedDate: new Date('2024-01-20'),
          description: 'Fixed calibration issue',
          technician: {
            name: 'Sarah Johnson',
            id: 'TECH002',
            contact: 'sarah.johnson@hospital.com'
          },
          priority: 'High',
          estimatedDuration: 4,
          actualDuration: 3,
          cost: 300.00,
          partsUsed: [
            {
              name: 'Calibration Sensor',
              partNumber: 'CAL-001',
              quantity: 1,
              cost: 200.00
            }
          ],
          findings: 'Calibration sensor was malfunctioning',
          actionsTaken: 'Replaced calibration sensor and recalibrated system',
          recommendations: 'Monitor calibration readings for next 30 days',
          isRecurring: false,
          notes: 'Issue resolved successfully',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await Maintenance.insertMany(sampleMaintenance);
      console.log('✅ Sample maintenance data inserted successfully!');
    }
  } catch (error) {
    console.error('Error seeding maintenance data:', error);
  }
};

// Call seed function after a delay to ensure equipment is seeded first
setTimeout(seedMaintenanceData, 2000);

module.exports = Maintenance;
