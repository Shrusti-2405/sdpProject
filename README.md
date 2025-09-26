# Hospital Equipment Tracker with Maintenance Bot

A comprehensive hospital equipment management system with AI-powered maintenance assistance.

## Features

### Equipment Management
- **CRUD Operations**: Add, edit, delete, and view equipment
- **Status Tracking**: Monitor equipment status (Operational, Maintenance, Out of Service, Repair, Retired)
- **Category Management**: Organize equipment by categories (Diagnostic, Therapeutic, Surgical, etc.)
- **Department Tracking**: Track equipment by hospital departments
- **Criticality Levels**: Mark equipment as Critical, High, Medium, or Low priority
- **Specifications**: Store technical specifications for each equipment
- **Location Tracking**: Track equipment location within the hospital

### Maintenance Management
- **Scheduling**: Schedule preventive, corrective, emergency, and inspection maintenance
- **Technician Assignment**: Assign maintenance tasks to specific technicians
- **Priority Management**: Set maintenance priority levels
- **Recurring Maintenance**: Schedule recurring maintenance tasks
- **Maintenance History**: Track all maintenance activities
- **Cost Tracking**: Monitor maintenance costs and parts used
- **Status Updates**: Track maintenance progress (Scheduled, In Progress, Completed)

### AI-Powered Maintenance Bot
- **Troubleshooting**: Get AI assistance for equipment issues
- **Maintenance Suggestions**: Receive intelligent maintenance recommendations
- **Safety Protocols**: Access safety guidelines for equipment maintenance
- **Schedule Recommendations**: Get optimal maintenance scheduling advice
- **Technical Guidance**: AI-powered technical support

### Dashboard & Analytics
- **Equipment Overview**: Total equipment count, categories, departments
- **Maintenance Stats**: Completion rates, overdue maintenance, upcoming tasks
- **Critical Equipment**: Monitor high-priority equipment
- **Status Breakdown**: Visual representation of equipment status
- **Recent Activity**: Track recent equipment additions and maintenance

## Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **OpenAI API**: AI chatbot integration
- **CORS**: Cross-origin resource sharing

### Frontend
- **React**: UI library
- **React Router**: Navigation
- **Bootstrap**: CSS framework
- **Axios**: HTTP client
- **Bootstrap Icons**: Icon library

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd recipemate/server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/Equipment_Tracker
PORT=5000
OPENAI_API_KEY=sk-bf725748416143d88b7ea444d68f0c90
```

5. Start the server:
```bash
npm start
# or for development
npm run dev
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd recipemate/client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Database Schema

### Equipment Collection
```javascript
{
  name: String,
  serialNumber: String (unique),
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
  specifications: Map,
  notes: String,
  maintenanceHistory: [Object],
  createdAt: Date,
  updatedAt: Date
}
```

### Maintenance Collection
```javascript
{
  equipmentId: ObjectId,
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
  partsUsed: [Object],
  findings: String,
  actionsTaken: String,
  recommendations: String,
  isRecurring: Boolean,
  recurringInterval: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Equipment Endpoints
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/:id` - Get equipment by ID
- `POST /api/equipment` - Create new equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment
- `PUT /api/equipment/:id/status` - Update equipment status
- `GET /api/equipment/stats` - Get dashboard statistics

### Maintenance Endpoints
- `GET /api/maintenance` - Get all maintenance records
- `GET /api/maintenance/:id` - Get maintenance by ID
- `POST /api/maintenance` - Create maintenance record
- `PUT /api/maintenance/:id` - Update maintenance record
- `DELETE /api/maintenance/:id` - Delete maintenance record
- `PUT /api/maintenance/:id/complete` - Complete maintenance
- `GET /api/maintenance/overdue` - Get overdue maintenance
- `GET /api/maintenance/upcoming` - Get upcoming maintenance

### Chatbot Endpoints
- `POST /api/chatbot/chat` - Chat with maintenance bot
- `POST /api/chatbot/suggestions` - Get maintenance suggestions
- `POST /api/chatbot/troubleshooting` - Get troubleshooting guide
- `POST /api/chatbot/schedule-recommendations` - Get schedule recommendations
- `POST /api/chatbot/safety-protocols` - Get safety protocols

## Usage

### Adding Equipment
1. Navigate to "Add Equipment" from the main menu
2. Fill in equipment details (name, serial number, category, etc.)
3. Set criticality level and maintenance interval
4. Add technical specifications if needed
5. Save the equipment

### Scheduling Maintenance
1. Go to "Maintenance" section
2. Click "Schedule Maintenance"
3. Select equipment and maintenance type
4. Assign technician and set priority
5. Set scheduled date and duration
6. Add description and notes

### Using the Maintenance Bot
1. Navigate to "Maintenance Bot"
2. Select chat mode (General, Troubleshooting, Suggestions, Safety)
3. Optionally select equipment for context
4. Type your question or use quick actions
5. Get AI-powered assistance

## Features in Detail

### Equipment Status Management
- **Operational**: Equipment is working normally
- **Maintenance**: Equipment is under maintenance
- **Out of Service**: Equipment is temporarily unavailable
- **Repair**: Equipment needs repair
- **Retired**: Equipment is no longer in use

### Maintenance Types
- **Preventive**: Regular scheduled maintenance
- **Corrective**: Fixing identified issues
- **Emergency**: Urgent repairs needed
- **Inspection**: Visual or functional checks
- **Calibration**: Adjusting equipment to standards

### Priority Levels
- **Critical**: Life-supporting or essential equipment
- **High**: Important equipment for patient care
- **Medium**: Standard equipment
- **Low**: Non-essential equipment

## Security Considerations

- API keys are stored in environment variables
- Input validation on all forms
- CORS configuration for cross-origin requests
- MongoDB connection security

## Future Enhancements

- User authentication and authorization
- Email notifications for maintenance alerts
- Mobile app development
- Advanced analytics and reporting
- Integration with hospital management systems
- Barcode/QR code scanning for equipment identification
- Automated maintenance scheduling based on usage
- Predictive maintenance using AI

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
