const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const equipmentRoutes = require('./routes/equipmentRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Equipment_Tracker';
mongoose.connect(MONGODB_URI)
.then(() => console.log('Connected to MongoDB - Equipment_Tracker database'))
.catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/equipment', equipmentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Hospital Equipment Tracker API is running!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});