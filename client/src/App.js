import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './views/Home';
import EquipmentList from './views/EquipmentList';
import AddEquipment from './views/AddEquipment';
import EditEquipment from './views/EditEquipment';
import MaintenanceList from './views/MaintenanceList';
import AddMaintenance from './views/AddMaintenance';
import MaintenanceChat from './views/MaintenanceChat';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container-fluid mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/equipment" element={<EquipmentList />} />
              <Route path="/add-equipment" element={<AddEquipment />} />
              <Route path="/edit-equipment/:id" element={<EditEquipment />} />
              <Route path="/maintenance" element={<MaintenanceList />} />
              <Route path="/add-maintenance" element={<AddMaintenance />} />
              <Route path="/maintenance-chat" element={<MaintenanceChat />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;