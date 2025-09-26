import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { equipmentAPI, maintenanceAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AnimatedCounter from '../components/AnimatedCounter';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

const Home = () => {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    totalCategories: 0,
    totalDepartments: 0,
    maintenanceDueCount: 0,
    criticalCount: 0
  });
  const [maintenanceStats, setMaintenanceStats] = useState({
    total: 0,
    completed: 0,
    scheduled: 0,
    overdue: 0,
    inProgress: 0,
    completionRate: 0
  });
  const [recentEquipment, setRecentEquipment] = useState([]);
  const [overdueMaintenance, setOverdueMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      
      // Try to get equipment data first
      let equipmentData = [];
      let maintenanceData = [];
      let overdueData = [];
      
      try {
        const equipmentResponse = await equipmentAPI.getAllEquipment();
        equipmentData = equipmentResponse.data.data || [];
        console.log('Equipment data loaded:', equipmentData.length, 'items');
      } catch (error) {
        console.error('Error loading equipment:', error.message);
      }
      
      try {
        const maintenanceResponse = await maintenanceAPI.getAllMaintenance();
        maintenanceData = maintenanceResponse.data.data || [];
        console.log('Maintenance data loaded:', maintenanceData.length, 'items');
      } catch (error) {
        console.error('Error loading maintenance:', error.message);
      }
      
      try {
        const overdueResponse = await maintenanceAPI.getOverdueMaintenance();
        overdueData = overdueResponse.data.data || [];
        console.log('Overdue data loaded:', overdueData.length, 'items');
      } catch (error) {
        console.error('Error loading overdue maintenance:', error.message);
      }
      
      // Calculate stats from the data
      const categories = [...new Set(equipmentData.map(item => item.category))];
      const departments = [...new Set(equipmentData.map(item => item.department))];
      const maintenanceDue = equipmentData.filter(item => {
        if (!item.nextMaintenanceDate) return false;
        return new Date(item.nextMaintenanceDate) <= new Date();
      });
      const critical = equipmentData.filter(item => item.criticality === 'Critical');
      
      setStats({
        totalEquipment: equipmentData.length,
        totalCategories: categories.length,
        totalDepartments: departments.length,
        maintenanceDueCount: maintenanceDue.length,
        criticalCount: critical.length
      });
      
      // Calculate maintenance stats
      const completed = maintenanceData.filter(m => m.status === 'Completed').length;
      const scheduled = maintenanceData.filter(m => m.status === 'Scheduled').length;
      const inProgress = maintenanceData.filter(m => m.status === 'In Progress').length;
      const overdue = overdueData.length;
      const total = maintenanceData.length;
      const completionRate = total > 0 ? (completed / total) * 100 : 0;
      
      setMaintenanceStats({
        total,
        completed,
        scheduled,
        overdue,
        inProgress,
        completionRate
      });
      
      setOverdueMaintenance(overdueData);
      
      // Get recent equipment
      const sortedEquipment = equipmentData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentEquipment(sortedEquipment.slice(0, 5));
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Operational': return 'bg-success';
      case 'Maintenance': return 'bg-warning';
      case 'Out of Service': return 'bg-danger';
      case 'Repair': return 'bg-info';
      case 'Retired': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-danger';
      case 'High': return 'bg-warning';
      case 'Medium': return 'bg-info';
      case 'Low': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard data..." />;
  }

  return (
    <div className="container-fluid">
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="jumbotron bg-gradient text-white p-5 rounded" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
          }}>
            <h1 className="display-4 fw-bold">
              <i className="bi bi-hospital me-3"></i>
              Hospital Equipment Tracker
            </h1>
            <p className="lead">
              Monitor, maintain, and manage your hospital equipment with AI-powered maintenance assistance
            </p>
            <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
            <p className="mb-4">Track equipment status, schedule maintenance, and get intelligent recommendations for optimal equipment performance.</p>
            <div className="d-flex gap-3">
              <Link className="btn btn-light btn-lg" to="/equipment" role="button">
                <i className="bi bi-gear me-2"></i>
                View Equipment
              </Link>
              <Link className="btn btn-outline-light btn-lg" to="/maintenance-chat" role="button">
                <i className="bi bi-robot me-2"></i>
                Maintenance Bot
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card text-white bg-primary h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title mb-1">Total Equipment</h6>
                  <h2 className="mb-0">
                    <AnimatedCounter end={stats.totalEquipment} />
                  </h2>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-gear" style={{ fontSize: '2rem', opacity: 0.8 }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card text-white bg-info h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title mb-1">Categories</h6>
                  <h2 className="mb-0">
                    <AnimatedCounter end={stats.totalCategories} />
                  </h2>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-tags" style={{ fontSize: '2rem', opacity: 0.8 }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card text-white bg-success h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title mb-1">Departments</h6>
                  <h2 className="mb-0">{stats.totalDepartments}</h2>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-building" style={{ fontSize: '2rem', opacity: 0.8 }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card text-white bg-warning h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title mb-1">Maintenance Due</h6>
                  <h2 className="mb-0">{stats.maintenanceDueCount}</h2>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem', opacity: 0.8 }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card text-white bg-danger h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title mb-1">Critical</h6>
                  <h2 className="mb-0">{stats.criticalCount}</h2>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-shield-exclamation" style={{ fontSize: '2rem', opacity: 0.8 }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className="card text-white bg-secondary h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title mb-1">Overdue</h6>
                  <h2 className="mb-0">{maintenanceStats.overdue}</h2>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-clock-history" style={{ fontSize: '2rem', opacity: 0.8 }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="row">
        <div className="col-lg-8">
          {/* Recent Equipment */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Recent Equipment
              </h5>
              <Link to="/equipment" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {recentEquipment.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Department</th>
                        <th>Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentEquipment.map((equipment) => (
                        <tr key={equipment._id}>
                          <td>
                            <strong>{equipment.name}</strong>
                            <br />
                            <small className="text-muted">{equipment.serialNumber}</small>
                          </td>
                          <td>{equipment.category}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(equipment.status)}`}>
                              {equipment.status}
                            </span>
                          </td>
                          <td>{equipment.department}</td>
                          <td>{equipment.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No equipment found.</p>
              )}
            </div>
          </div>

          {/* Overdue Maintenance */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Overdue Maintenance
              </h5>
              <Link to="/maintenance" className="btn btn-sm btn-outline-danger">
                View All
              </Link>
            </div>
            <div className="card-body">
              {overdueMaintenance.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Equipment</th>
                        <th>Type</th>
                        <th>Priority</th>
                        <th>Scheduled Date</th>
                        <th>Technician</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overdueMaintenance.slice(0, 5).map((maintenance) => (
                        <tr key={maintenance._id}>
                          <td>
                            <strong>{maintenance.equipmentId?.name || 'Unknown'}</strong>
                            <br />
                            <small className="text-muted">{maintenance.equipmentId?.serialNumber || ''}</small>
                          </td>
                          <td>{maintenance.type}</td>
                          <td>
                            <span className={`badge ${getPriorityBadgeClass(maintenance.priority)}`}>
                              {maintenance.priority}
                            </span>
                          </td>
                          <td>
                            {new Date(maintenance.scheduledDate).toLocaleDateString()}
                          </td>
                          <td>{maintenance.technician.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No overdue maintenance found.</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Quick Actions */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-lightning me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/add-equipment" className="btn btn-success">
                  <i className="bi bi-plus-circle me-2"></i>
                  Add New Equipment
                </Link>
                <Link to="/add-maintenance" className="btn btn-info">
                  <i className="bi bi-tools me-2"></i>
                  Schedule Maintenance
                </Link>
                <Link to="/maintenance-chat" className="btn btn-warning">
                  <i className="bi bi-robot me-2"></i>
                  Maintenance Bot
                </Link>
                <Link to="/equipment" className="btn btn-outline-primary">
                  <i className="bi bi-list-ul me-2"></i>
                  Manage Equipment
                </Link>
              </div>
            </div>
          </div>

          {/* Maintenance Stats */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Maintenance Overview
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="border-end">
                    <h4 className="text-success">{maintenanceStats.completed}</h4>
                    <small className="text-muted">Completed</small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <h4 className="text-info">{maintenanceStats.scheduled}</h4>
                  <small className="text-muted">Scheduled</small>
                </div>
                <div className="col-6">
                  <div className="border-end">
                    <h4 className="text-warning">{maintenanceStats.inProgress}</h4>
                    <small className="text-muted">In Progress</small>
                  </div>
                </div>
                <div className="col-6">
                  <h4 className="text-danger">{maintenanceStats.overdue}</h4>
                  <small className="text-muted">Overdue</small>
                </div>
              </div>
              <div className="mt-3">
                <div className="progress">
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: `${maintenanceStats.completionRate || 0}%` }}
                  ></div>
                </div>
                <small className="text-muted">Completion Rate: {(maintenanceStats.completionRate || 0).toFixed(1)}%</small>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">💡 Tips</h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <small>
                    <strong>Regular maintenance:</strong> Schedule preventive maintenance to avoid equipment failures
                  </small>
                </li>
                <li className="mb-2">
                  <small>
                    <strong>Critical equipment:</strong> Monitor critical equipment more frequently
                  </small>
                </li>
                <li className="mb-2">
                  <small>
                    <strong>Documentation:</strong> Keep detailed maintenance records for compliance
                  </small>
                </li>
                <li>
                  <small>
                    <strong>AI assistance:</strong> Use the maintenance bot for troubleshooting and recommendations
                  </small>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;