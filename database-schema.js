// Hospital Equipment Tracker - Database Schema
// MongoDB Schema Commands and Collections

// ===========================================
// DATABASE CONFIGURATION
// ===========================================

// Use the Equipment_Tracker database
use Equipment_Tracker;

// ===========================================
// EQUIPMENT COLLECTION SCHEMA
// ===========================================

// Create Equipment Collection with Indexes
db.createCollection("equipment", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "serialNumber", "category", "status", "location", "department", "manufacturer", "model", "purchaseDate", "criticality"],
      properties: {
        name: {
          bsonType: "string",
          description: "Equipment name is required and must be a string"
        },
        serialNumber: {
          bsonType: "string",
          description: "Serial number is required and must be a string"
        },
        category: {
          bsonType: "string",
          enum: ["Diagnostic", "Therapeutic", "Surgical", "Monitoring", "Life Support", "Imaging", "Laboratory", "Rehabilitation", "Emergency", "Other"],
          description: "Category must be one of the predefined values"
        },
        status: {
          bsonType: "string",
          enum: ["Operational", "Maintenance", "Out of Service", "Repair", "Retired"],
          description: "Status must be one of the predefined values"
        },
        location: {
          bsonType: "string",
          description: "Location is required and must be a string"
        },
        department: {
          bsonType: "string",
          description: "Department is required and must be a string"
        },
        manufacturer: {
          bsonType: "string",
          description: "Manufacturer is required and must be a string"
        },
        model: {
          bsonType: "string",
          description: "Model is required and must be a string"
        },
        purchaseDate: {
          bsonType: "date",
          description: "Purchase date is required and must be a date"
        },
        warrantyExpiry: {
          bsonType: ["date", "null"],
          description: "Warranty expiry must be a date or null"
        },
        lastMaintenanceDate: {
          bsonType: ["date", "null"],
          description: "Last maintenance date must be a date or null"
        },
        nextMaintenanceDate: {
          bsonType: ["date", "null"],
          description: "Next maintenance date must be a date or null"
        },
        maintenanceInterval: {
          bsonType: "int",
          minimum: 1,
          description: "Maintenance interval must be a positive integer"
        },
        criticality: {
          bsonType: "string",
          enum: ["Critical", "High", "Medium", "Low"],
          description: "Criticality must be one of the predefined values"
        },
        specifications: {
          bsonType: "object",
          description: "Specifications must be an object"
        },
        notes: {
          bsonType: "string",
          description: "Notes must be a string"
        },
        maintenanceHistory: {
          bsonType: "array",
          description: "Maintenance history must be an array"
        }
      }
    }
  }
});

// Create Indexes for Equipment Collection
db.equipment.createIndex({ "serialNumber": 1 }, { unique: true });
db.equipment.createIndex({ "category": 1 });
db.equipment.createIndex({ "status": 1 });
db.equipment.createIndex({ "department": 1 });
db.equipment.createIndex({ "nextMaintenanceDate": 1 });
db.equipment.createIndex({ "criticality": 1 });
db.equipment.createIndex({ "name": "text", "category": "text", "manufacturer": "text", "model": "text", "location": "text" });
db.equipment.createIndex({ "createdAt": 1 });
db.equipment.createIndex({ "updatedAt": 1 });

// ===========================================
// MAINTENANCE COLLECTION SCHEMA
// ===========================================

// Create Maintenance Collection with Indexes
db.createCollection("maintenances", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["equipmentId", "type", "status", "scheduledDate", "description", "technician", "priority"],
      properties: {
        equipmentId: {
          bsonType: "objectId",
          description: "Equipment ID is required and must be an ObjectId"
        },
        type: {
          bsonType: "string",
          enum: ["Preventive", "Corrective", "Emergency", "Inspection", "Calibration"],
          description: "Type must be one of the predefined values"
        },
        status: {
          bsonType: "string",
          enum: ["Scheduled", "In Progress", "Completed", "Cancelled", "Overdue"],
          description: "Status must be one of the predefined values"
        },
        scheduledDate: {
          bsonType: "date",
          description: "Scheduled date is required and must be a date"
        },
        completedDate: {
          bsonType: ["date", "null"],
          description: "Completed date must be a date or null"
        },
        description: {
          bsonType: "string",
          description: "Description is required and must be a string"
        },
        technician: {
          bsonType: "object",
          required: ["name", "id", "contact"],
          properties: {
            name: { bsonType: "string" },
            id: { bsonType: "string" },
            contact: { bsonType: "string" }
          },
          description: "Technician information is required"
        },
        priority: {
          bsonType: "string",
          enum: ["Low", "Medium", "High", "Critical"],
          description: "Priority must be one of the predefined values"
        },
        estimatedDuration: {
          bsonType: "int",
          minimum: 0,
          description: "Estimated duration must be a non-negative integer"
        },
        actualDuration: {
          bsonType: ["int", "null"],
          minimum: 0,
          description: "Actual duration must be a non-negative integer or null"
        },
        cost: {
          bsonType: ["double", "int"],
          minimum: 0,
          description: "Cost must be a non-negative number"
        },
        partsUsed: {
          bsonType: "array",
          description: "Parts used must be an array"
        },
        findings: {
          bsonType: "string",
          description: "Findings must be a string"
        },
        actionsTaken: {
          bsonType: "string",
          description: "Actions taken must be a string"
        },
        recommendations: {
          bsonType: "string",
          description: "Recommendations must be a string"
        },
        nextMaintenanceDate: {
          bsonType: ["date", "null"],
          description: "Next maintenance date must be a date or null"
        },
        attachments: {
          bsonType: "array",
          description: "Attachments must be an array"
        },
        isRecurring: {
          bsonType: "bool",
          description: "Is recurring must be a boolean"
        },
        recurringInterval: {
          bsonType: ["int", "null"],
          minimum: 1,
          description: "Recurring interval must be a positive integer or null"
        },
        notes: {
          bsonType: "string",
          description: "Notes must be a string"
        }
      }
    }
  }
});

// Create Indexes for Maintenance Collection
db.maintenances.createIndex({ "equipmentId": 1 });
db.maintenances.createIndex({ "status": 1 });
db.maintenances.createIndex({ "scheduledDate": 1 });
db.maintenances.createIndex({ "type": 1 });
db.maintenances.createIndex({ "priority": 1 });
db.maintenances.createIndex({ "technician.id": 1 });
db.maintenances.createIndex({ "createdAt": 1 });
db.maintenances.createIndex({ "updatedAt": 1 });

// ===========================================
// SAMPLE DATA INSERTION
// ===========================================

// Insert Sample Equipment Data
db.equipment.insertMany([
  {
    name: "MRI Scanner",
    serialNumber: "MRI-001-2024",
    category: "Imaging",
    status: "Operational",
    location: "Radiology Department",
    department: "Radiology",
    manufacturer: "Siemens",
    model: "Magnetom Skyra 3T",
    purchaseDate: new Date("2023-01-15"),
    warrantyExpiry: new Date("2026-01-15"),
    lastMaintenanceDate: new Date("2024-01-15"),
    nextMaintenanceDate: new Date("2024-04-15"),
    maintenanceInterval: 90,
    criticality: "Critical",
    specifications: {
      "Field Strength": "3 Tesla",
      "Patient Weight Limit": "200 kg",
      "Room Requirements": "Shielded Room"
    },
    notes: "Primary MRI scanner for diagnostic imaging",
    maintenanceHistory: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Ventilator",
    serialNumber: "VENT-002-2024",
    category: "Life Support",
    status: "Operational",
    location: "ICU Room 1",
    department: "ICU",
    manufacturer: "Medtronic",
    model: "PB980",
    purchaseDate: new Date("2023-03-20"),
    warrantyExpiry: new Date("2025-03-20"),
    lastMaintenanceDate: new Date("2024-01-20"),
    nextMaintenanceDate: new Date("2024-02-20"),
    maintenanceInterval: 30,
    criticality: "Critical",
    specifications: {
      "Modes": "Volume, Pressure, SIMV",
      "Flow Range": "2-120 L/min",
      "Pressure Range": "0-120 cmH2O"
    },
    notes: "Critical life support equipment",
    maintenanceHistory: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "X-Ray Machine",
    serialNumber: "XR-003-2024",
    category: "Imaging",
    status: "Maintenance",
    location: "Emergency Department",
    department: "Emergency",
    manufacturer: "GE Healthcare",
    model: "Definium 8000",
    purchaseDate: new Date("2022-08-10"),
    warrantyExpiry: new Date("2024-08-10"),
    lastMaintenanceDate: new Date("2024-01-10"),
    nextMaintenanceDate: new Date("2024-03-10"),
    maintenanceInterval: 60,
    criticality: "High",
    specifications: {
      "Power": "80 kW",
      "Tube Current": "800 mA",
      "Exposure Time": "0.001-10 s"
    },
    notes: "Digital radiography system",
    maintenanceHistory: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Defibrillator",
    serialNumber: "DEF-004-2024",
    category: "Emergency",
    status: "Operational",
    location: "Emergency Room",
    department: "Emergency",
    manufacturer: "Philips",
    model: "HeartStart MRx",
    purchaseDate: new Date("2023-06-15"),
    warrantyExpiry: new Date("2026-06-15"),
    lastMaintenanceDate: new Date("2024-01-15"),
    nextMaintenanceDate: new Date("2024-02-15"),
    maintenanceInterval: 30,
    criticality: "Critical",
    specifications: {
      "Energy Range": "1-360 J",
      "Waveform": "Biphasic",
      "Battery Life": "8 hours"
    },
    notes: "Automated external defibrillator",
    maintenanceHistory: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Ultrasound Machine",
    serialNumber: "US-005-2024",
    category: "Diagnostic",
    status: "Operational",
    location: "Cardiology Department",
    department: "Cardiology",
    manufacturer: "Philips",
    model: "EPIQ 7",
    purchaseDate: new Date("2023-09-05"),
    warrantyExpiry: new Date("2026-09-05"),
    lastMaintenanceDate: new Date("2024-01-05"),
    nextMaintenanceDate: new Date("2024-02-20"),
    maintenanceInterval: 45,
    criticality: "High",
    specifications: {
      "Transducers": "4",
      "Frequency Range": "1-15 MHz",
      "Display": "21 inch LED"
    },
    notes: "Advanced cardiac ultrasound system",
    maintenanceHistory: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert Sample Maintenance Data
db.maintenances.insertMany([
  {
    equipmentId: ObjectId(), // This will be replaced with actual equipment ID
    type: "Preventive",
    status: "Scheduled",
    scheduledDate: new Date("2024-02-15"),
    description: "Monthly preventive maintenance check",
    technician: {
      name: "John Smith",
      id: "TECH001",
      contact: "john.smith@hospital.com"
    },
    priority: "Medium",
    estimatedDuration: 2,
    cost: 150.00,
    partsUsed: [],
    findings: "",
    actionsTaken: "",
    recommendations: "",
    isRecurring: true,
    recurringInterval: 30,
    notes: "Regular maintenance schedule",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    equipmentId: ObjectId(), // This will be replaced with actual equipment ID
    type: "Corrective",
    status: "Completed",
    scheduledDate: new Date("2024-01-20"),
    completedDate: new Date("2024-01-20"),
    description: "Fixed calibration issue",
    technician: {
      name: "Sarah Johnson",
      id: "TECH002",
      contact: "sarah.johnson@hospital.com"
    },
    priority: "High",
    estimatedDuration: 4,
    actualDuration: 3,
    cost: 300.00,
    partsUsed: [
      {
        name: "Calibration Sensor",
        partNumber: "CAL-001",
        quantity: 1,
        cost: 200.00
      }
    ],
    findings: "Calibration sensor was malfunctioning",
    actionsTaken: "Replaced calibration sensor and recalibrated system",
    recommendations: "Monitor calibration readings for next 30 days",
    isRecurring: false,
    notes: "Issue resolved successfully",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// ===========================================
// USEFUL QUERIES
// ===========================================

// Get all equipment
db.equipment.find();

// Get equipment by status
db.equipment.find({ status: "Operational" });

// Get equipment by category
db.equipment.find({ category: "Imaging" });

// Get equipment by department
db.equipment.find({ department: "ICU" });

// Get critical equipment
db.equipment.find({ criticality: { $in: ["Critical", "High"] } });

// Get equipment due for maintenance
db.equipment.find({ 
  nextMaintenanceDate: { $lte: new Date() },
  status: { $ne: "Retired" }
});

// Get maintenance by equipment
db.maintenances.find({ equipmentId: ObjectId("equipment_id_here") });

// Get overdue maintenance
db.maintenances.find({
  status: "Scheduled",
  scheduledDate: { $lt: new Date() }
});

// Get maintenance by technician
db.maintenances.find({ "technician.id": "TECH001" });

// Get maintenance statistics
db.maintenances.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  }
]);

// Get equipment statistics
db.equipment.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  }
]);

// Get maintenance by priority
db.maintenances.aggregate([
  {
    $group: {
      _id: "$priority",
      count: { $sum: 1 }
    }
  }
]);

// Search equipment by text
db.equipment.find({ $text: { $search: "MRI" } });

// Get equipment with maintenance due in next 7 days
db.equipment.find({
  nextMaintenanceDate: {
    $gte: new Date(),
    $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
});

// ===========================================
// MAINTENANCE FUNCTIONS
// ===========================================

// Function to update equipment maintenance dates
function updateMaintenanceDates(equipmentId, lastMaintenanceDate, maintenanceInterval) {
  const nextDate = new Date(lastMaintenanceDate);
  nextDate.setDate(nextDate.getDate() + maintenanceInterval);
  
  return db.equipment.updateOne(
    { _id: equipmentId },
    {
      $set: {
        lastMaintenanceDate: lastMaintenanceDate,
        nextMaintenanceDate: nextDate,
        updatedAt: new Date()
      }
    }
  );
}

// Function to get equipment maintenance history
function getEquipmentMaintenanceHistory(equipmentId) {
  return db.maintenances.find({ equipmentId: equipmentId }).sort({ scheduledDate: -1 });
}

// Function to get overdue maintenance count
function getOverdueMaintenanceCount() {
  return db.maintenances.countDocuments({
    status: "Scheduled",
    scheduledDate: { $lt: new Date() }
  });
}

// Function to get upcoming maintenance
function getUpcomingMaintenance(days = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return db.maintenances.find({
    status: "Scheduled",
    scheduledDate: { $lte: futureDate, $gte: new Date() }
  });
}

// ===========================================
// DATABASE BACKUP AND RESTORE COMMANDS
// ===========================================

// Backup the database
// mongodump --db Equipment_Tracker --out /backup/path

// Restore the database
// mongorestore --db Equipment_Tracker /backup/path/Equipment_Tracker

// Export equipment collection
// mongoexport --db Equipment_Tracker --collection equipment --out equipment.json

// Import equipment collection
// mongoimport --db Equipment_Tracker --collection equipment --file equipment.json

// ===========================================
// PERFORMANCE OPTIMIZATION
// ===========================================

// Analyze query performance
db.equipment.find({ status: "Operational" }).explain("executionStats");

// Create compound indexes for common queries
db.equipment.createIndex({ "status": 1, "criticality": 1 });
db.maintenances.createIndex({ "equipmentId": 1, "status": 1 });
db.maintenances.createIndex({ "scheduledDate": 1, "status": 1 });

// ===========================================
// CLEANUP COMMANDS
// ===========================================

// Remove all equipment (use with caution)
// db.equipment.deleteMany({});

// Remove all maintenance records (use with caution)
// db.maintenances.deleteMany({});

// Drop the entire database (use with caution)
// db.dropDatabase();

// ===========================================
// MONITORING QUERIES
// ===========================================

// Get database stats
db.stats();

// Get collection stats
db.equipment.stats();
db.maintenances.stats();

// Get index usage
db.equipment.aggregate([{ $indexStats: {} }]);
db.maintenances.aggregate([{ $indexStats: {} }]);

// Check for duplicate serial numbers
db.equipment.aggregate([
  { $group: { _id: "$serialNumber", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
]);

// ===========================================
// END OF SCHEMA FILE
// ===========================================
