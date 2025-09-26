# 🏥 Hospital Equipment Tracker - Quick Start

## 🚀 **FASTEST WAY TO RUN (5 MINUTES)**

### **Option 1: Automatic Setup (Recommended)**
1. **Double-click** `start-project.bat`
2. **Wait** for both server and client to start
3. **Open** http://localhost:3000 in your browser
4. **Done!** 🎉

### **Option 2: Manual Setup**

#### **Step 1: Start Server**
```bash
cd recipemate/server
npm install
npm start
```

#### **Step 2: Start Client (New Terminal)**
```bash
cd recipemate/client
npm install
npm start
```

#### **Step 3: Add Sample Data**
```bash
cd recipemate
node insert-sample-data.js
```

## 🔧 **If Data Not Loading:**

### **Check Server Status:**
- Open http://localhost:5000/api/health
- Should show: `{"message":"Hospital Equipment Tracker API is running!"}`

### **Add Sample Data:**
```bash
cd recipemate
node insert-sample-data.js
```

### **Check Database:**
```bash
mongo
use Equipment_Tracker
db.equipment.find()
```

## 🎨 **Beautiful Features:**

✅ **Glass Morphism UI** - Modern translucent design
✅ **Smooth Animations** - Hover effects and transitions  
✅ **AI Maintenance Bot** - OpenAI-powered assistance
✅ **Real-time Updates** - Live data synchronization
✅ **Mobile Responsive** - Works on all devices
✅ **Equipment Management** - Full CRUD operations
✅ **Maintenance Scheduling** - Complete maintenance tracking

## 📱 **What You Get:**

- **Dashboard** - Equipment overview with statistics
- **Equipment List** - Manage all hospital equipment
- **Add Equipment** - Register new equipment
- **Maintenance** - Schedule and track maintenance
- **AI Bot** - Get maintenance assistance
- **Beautiful UI** - Modern, animated interface

## 🎯 **Key Features:**

### **Equipment Management:**
- Add/Edit/Delete equipment
- Track equipment status
- Monitor maintenance schedules
- Search and filter equipment

### **Maintenance Bot:**
- Troubleshooting assistance
- Maintenance recommendations
- Safety protocols
- Schedule optimization

### **Dashboard:**
- Real-time statistics
- Equipment status overview
- Maintenance alerts
- Quick actions

## 🚨 **Troubleshooting:**

### **Server Not Starting:**
```bash
# Check if port 5000 is free
netstat -an | findstr :5000

# Kill process if needed
taskkill /f /im node.exe
```

### **Client Not Starting:**
```bash
# Check if port 3000 is free
netstat -an | findstr :3000

# Clear cache
npm start -- --reset-cache
```

### **Database Issues:**
```bash
# Start MongoDB
mongod

# Check connection
mongo
```

## 🎉 **Success!**

Your Hospital Equipment Tracker is now running with:
- ✅ Beautiful, animated UI
- ✅ Real-time data synchronization  
- ✅ AI-powered maintenance bot
- ✅ Complete equipment management
- ✅ Advanced maintenance scheduling
- ✅ Mobile-responsive design

**Open http://localhost:3000 to see your application!** 🏥✨
