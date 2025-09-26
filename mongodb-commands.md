# MongoDB Commands for Hospital Equipment Tracker

## Database Setup Commands

### 1. Create Database and Switch to It
```javascript
use Equipment_Tracker;
```

### 2. Create Equipment Collection with Validation
```javascript
db.createCollection("equipment", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "serialNumber", "category", "status", "location", "department", "manufacturer", "model", "purchaseDate", "criticality"],
      properties: {
        name: { bsonType: "string" },
        serialNumber: { bsonType: "string" },
        category: { 
          bsonType: "string",
          enum: ["Diagnostic", "Therapeutic", "Surgical", "Monitoring", "Life Support", "Imaging", "Laboratory", "Rehabilitation", "Emergency", "Other"]
        },
        status: { 
          bsonType: "string",
          enum: ["Operational", "Maintenance", "Out of Service", "Repair", "Retired"]
        },
        location: { bsonType: "string" },
        department: { bsonType: "string" },
        manufacturer: { bsonType: "string" },
        model: { bsonType: "string" },
        purchaseDate: { bsonType: "date" },
        warrantyExpiry: { bsonType: ["date", "null"] },
        lastMaintenanceDate: { bsonType: ["date", "null"] },
        nextMaintenanceDate: { bsonType: ["date", "null"] },
        maintenanceInterval: { bsonType: "int", minimum: 1 },
        criticality: { 
          bsonType: "string",
          enum: ["Critical", "High", "Medium", "Low"]
        },
        specifications: { bsonType: "object" },
        notes: { bsonType: "string" },
        maintenanceHistory: { bsonType: "array" }
      }
    }
  }
});
```

### 3. Create Maintenance Collection with Validation
```javascript
db.createCollection("maintenances", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["equipmentId", "type", "status", "scheduledDate", "description", "technician", "priority"],
      properties: {
        equipmentId: { bsonType: "objectId" },
        type: { 
          bsonType: "string",
          enum: ["Preventive", "Corrective", "Emergency", "Inspection", "Calibration"]
        },
        status: { 
          bsonType: "string",
          enum: ["Scheduled", "In Progress", "Completed", "Cancelled", "Overdue"]
        },
        scheduledDate: { bsonType: "date" },
        completedDate: { bsonType: ["date", "null"] },
        description: { bsonType: "string" },
        technician: {
          bsonType: "object",
          required: ["name", "id", "contact"],
          properties: {
            name: { bsonType: "string" },
            id: { bsonType: "string" },
            contact: { bsonType: "string" }
          }
        },
        priority: { 
          bsonType: "string",
          enum: ["Low", "Medium", "High", "Critical"]
        },
        estimatedDuration: { bsonType: "int", minimum: 0 },
        actualDuration: { bsonType: ["int", "null"], minimum: 0 },
        cost: { bsonType: ["double", "int"], minimum: 0 },
        partsUsed: { bsonType: "array" },
        findings: { bsonType: "string" },
        actionsTaken: { bsonType: "string" },
        recommendations: { bsonType: "string" },
        isRecurring: { bsonType: "bool" },
        recurringInterval: { bsonType: ["int", "null"], minimum: 1 },
        notes: { bsonType: "string" }
      }
    }
  }
});
```

## Index Creation Commands

### Equipment Collection Indexes
```javascript
// Unique index on serial number
db.equipment.createIndex({ "serialNumber": 1 }, { unique: true });

// Category index
db.equipment.createIndex({ "category": 1 });

// Status index
db.equipment.createIndex({ "status": 1 });

// Department index
db.equipment.createIndex({ "department": 1 });

// Next maintenance date index
db.equipment.createIndex({ "nextMaintenanceDate": 1 });

// Criticality index
db.equipment.createIndex({ "criticality": 1 });

// Text search index
db.equipment.createIndex({ 
  "name": "text", 
  "category": "text", 
  "manufacturer": "text", 
  "model": "text", 
  "location": "text" 
});

// Timestamp indexes
db.equipment.createIndex({ "createdAt": 1 });
db.equipment.createIndex({ "updatedAt": 1 });
```

### Maintenance Collection Indexes
```javascript
// Equipment ID index
db.maintenances.createIndex({ "equipmentId": 1 });

// Status index
db.maintenances.createIndex({ "status": 1 });

// Scheduled date index
db.maintenances.createIndex({ "scheduledDate": 1 });

// Type index
db.maintenances.createIndex({ "type": 1 });

// Priority index
db.maintenances.createIndex({ "priority": 1 });

// Technician ID index
db.maintenances.createIndex({ "technician.id": 1 });

// Timestamp indexes
db.maintenances.createIndex({ "createdAt": 1 });
db.maintenances.createIndex({ "updatedAt": 1 });
```

## Sample Data Insertion Commands

### Insert Sample Equipment
```javascript
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
```

## Common Query Commands

### Equipment Queries
```javascript
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

// Search equipment by text
db.equipment.find({ $text: { $search: "MRI" } });

// Get equipment with maintenance due in next 7 days
db.equipment.find({
  nextMaintenanceDate: {
    $gte: new Date(),
    $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
});
```

### Maintenance Queries
```javascript
// Get all maintenance records
db.maintenances.find();

// Get maintenance by equipment (replace with actual equipment ID)
db.maintenances.find({ equipmentId: ObjectId("equipment_id_here") });

// Get overdue maintenance
db.maintenances.find({
  status: "Scheduled",
  scheduledDate: { $lt: new Date() }
});

// Get maintenance by technician
db.maintenances.find({ "technician.id": "TECH001" });

// Get upcoming maintenance (next 7 days)
db.maintenances.find({
  status: "Scheduled",
  scheduledDate: { 
    $gte: new Date(),
    $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
});
```

### Statistics Queries
```javascript
// Get maintenance statistics by status
db.maintenances.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  }
]);

// Get equipment statistics by status
db.equipment.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  }
]);

// Get maintenance statistics by priority
db.maintenances.aggregate([
  {
    $group: {
      _id: "$priority",
      count: { $sum: 1 }
    }
  }
]);

// Get equipment statistics by category
db.equipment.aggregate([
  {
    $group: {
      _id: "$category",
      count: { $sum: 1 }
    }
  }
]);
```

## Utility Functions

### Update Maintenance Dates
```javascript
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
```

### Get Equipment Maintenance History
```javascript
function getEquipmentMaintenanceHistory(equipmentId) {
  return db.maintenances.find({ equipmentId: equipmentId }).sort({ scheduledDate: -1 });
}
```

### Get Overdue Maintenance Count
```javascript
function getOverdueMaintenanceCount() {
  return db.maintenances.countDocuments({
    status: "Scheduled",
    scheduledDate: { $lt: new Date() }
  });
}
```

## Database Management Commands

### Backup Database
```bash
mongodump --db Equipment_Tracker --out /backup/path
```

### Restore Database
```bash
mongorestore --db Equipment_Tracker /backup/path/Equipment_Tracker
```

### Export Collection
```bash
mongoexport --db Equipment_Tracker --collection equipment --out equipment.json
```

### Import Collection
```bash
mongoimport --db Equipment_Tracker --collection equipment --file equipment.json
```

### Drop Database (Use with caution!)
```javascript
db.dropDatabase();
```

### Get Database Statistics
```javascript
db.stats();
db.equipment.stats();
db.maintenances.stats();
```

## Performance Monitoring

### Analyze Query Performance
```javascript
db.equipment.find({ status: "Operational" }).explain("executionStats");
```

### Check Index Usage
```javascript
db.equipment.aggregate([{ $indexStats: {} }]);
db.maintenances.aggregate([{ $indexStats: {} }]);
```

### Check for Duplicate Serial Numbers
```javascript
db.equipment.aggregate([
  { $group: { _id: "$serialNumber", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
]);
```

## Complete Setup Script

To set up the entire database, run these commands in order:

1. **Switch to database**: `use Equipment_Tracker;`
2. **Create collections**: Run the collection creation commands
3. **Create indexes**: Run all index creation commands
4. **Insert sample data**: Run the sample data insertion commands
5. **Verify setup**: Run some test queries to ensure everything works

This will give you a fully functional Hospital Equipment Tracker database with proper validation, indexing, and sample data.
