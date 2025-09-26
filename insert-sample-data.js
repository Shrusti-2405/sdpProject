// Insert sample data into MongoDB
const mongoose = require('./server/node_modules/mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Equipment_Tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Equipment Schema
const equipmentSchema = new mongoose.Schema({
  name: String,
  serialNumber: String,
  category: String,
  status: String,
  location: String,
  department: String,
  manufacturer: String,
  model: String,
  purchaseDate: Date,
  warrantyExpiry: Date,
  lastMaintenanceDate: Date,
  nextMaintenanceDate: Date,
  maintenanceInterval: Number,
  criticality: String,
  specifications: Object,
  notes: String,
  maintenanceHistory: Array,
  createdAt: Date,
  updatedAt: Date
});

// Maintenance Schema
const maintenanceSchema = new mongoose.Schema({
  equipmentId: mongoose.Schema.Types.ObjectId,
  type: String,
  status: String,
  scheduledDate: Date,
  completedDate: Date,
  description: String,
  technician: {
    name: String,
    id: String,
    contact: String
  },
  priority: String,
  estimatedDuration: Number,
  actualDuration: Number,
  cost: Number,
  partsUsed: Array,
  findings: String,
  actionsTaken: String,
  recommendations: String,
  isRecurring: Boolean,
  recurringInterval: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
});

const Equipment = mongoose.model('Equipment', equipmentSchema);
const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

// Sample equipment data
const sampleEquipment = [
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
];

// Sample maintenance data
const sampleMaintenance = [
  {
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
];

// Insert data function
async function insertSampleData() {
  try {
    console.log('Connecting to MongoDB...');
    
    // Clear existing data
    await Equipment.deleteMany({});
    await Maintenance.deleteMany({});
    console.log('Cleared existing data');
    
    // Insert equipment
    const equipmentDocs = await Equipment.insertMany(sampleEquipment);
    console.log('Inserted equipment:', equipmentDocs.length);
    
    // Insert maintenance with equipment references
    const maintenanceData = sampleMaintenance.map((maintenance, index) => ({
      ...maintenance,
      equipmentId: equipmentDocs[index % equipmentDocs.length]._id
    }));
    
    const maintenanceDocs = await Maintenance.insertMany(maintenanceData);
    console.log('Inserted maintenance:', maintenanceDocs.length);
    
    console.log('✅ Sample data inserted successfully!');
    console.log('Equipment count:', await Equipment.countDocuments());
    console.log('Maintenance count:', await Maintenance.countDocuments());
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
    process.exit(1);
  }
}

// Run the insertion
insertSampleData();
