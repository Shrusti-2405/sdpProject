import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { maintenanceAPI } from '../services/api';

const MaintenanceList = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const response = await maintenanceAPI.getAllMaintenance();
      setMaintenance(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching maintenance:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await maintenanceAPI.deleteMaintenance(id);
        setMaintenance(maintenance.filter(item => item._id !== id));
      } catch (error) {
        console.error('Error deleting maintenance:', error);
        alert('Error deleting maintenance record');
      }
    }
  };

  const handleComplete = async (id) => {
    const actualDuration = prompt('Enter actual duration (hours):');
    const findings = prompt('Enter findings:');
    const actionsTaken = prompt('Enter actions taken:');
    const recommendations = prompt('Enter recommendations:');

    if (actualDuration !== null) {
      try {
        await maintenanceAPI.completeMaintenance(id, {
          actualDuration: parseFloat(actualDuration),
          findings,
          actionsTaken,
          recommendations
        });
        fetchMaintenance(); // Refresh the list
      } catch (error) {
        console.error('Error completing maintenance:', error);
        alert('Error completing maintenance');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'bg-success';
      case 'In Progress': return 'bg-info';
      case 'Scheduled': return 'bg-warning';
      case 'Cancelled': return 'bg-secondary';
      case 'Overdue': return 'bg-danger';
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

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'Preventive': return 'bg-primary';
      case 'Corrective': return 'bg-warning';
      case 'Emergency': return 'bg-danger';
      case 'Inspection': return 'bg-info';
      case 'Calibration': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const filteredMaintenance = maintenance.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.equipmentId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.technician.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesType = !typeFilter || item.type === typeFilter;
    const matchesPriority = !priorityFilter || item.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const statuses = [...new Set(maintenance.map(item => item.status))];
  const types = [...new Set(maintenance.map(item => item.type))];
  const priorities = [...new Set(maintenance.map(item => item.priority))];

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2>
              <i className="bi bi-tools me-2"></i>
              Maintenance Management
            </h2>
            <Link to="/add-maintenance" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              Schedule Maintenance
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Search</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search maintenance..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="">All Types</option>
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="">All Priorities</option>
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('');
                      setTypeFilter('');
                      setPriorityFilter('');
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                Maintenance Records ({filteredMaintenance.length} items)
              </h5>
            </div>
            <div className="card-body">
              {filteredMaintenance.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Equipment</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Scheduled Date</th>
                        <th>Technician</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMaintenance.map((item) => (
                        <tr key={item._id}>
                          <td>
                            <div>
                              <strong>{item.equipmentId?.name || 'Unknown'}</strong>
                              <br />
                              <small className="text-muted">{item.equipmentId?.serialNumber || ''}</small>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${getTypeBadgeClass(item.type)}`}>
                              {item.type}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${getPriorityBadgeClass(item.priority)}`}>
                              {item.priority}
                            </span>
                          </td>
                          <td>
                            {new Date(item.scheduledDate).toLocaleDateString()}
                            {item.status === 'Scheduled' && new Date(item.scheduledDate) < new Date() && (
                              <>
                                <br />
                                <small className="text-danger">Overdue</small>
                              </>
                            )}
                          </td>
                          <td>
                            <div>
                              {item.technician.name}
                              <br />
                              <small className="text-muted">{item.technician.id}</small>
                            </div>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Link
                                to={`/edit-maintenance/${item._id}`}
                                className="btn btn-sm btn-outline-primary"
                                title="Edit"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              {item.status === 'Scheduled' && (
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => handleComplete(item._id)}
                                  title="Complete"
                                >
                                  <i className="bi bi-check-circle"></i>
                                </button>
                              )}
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(item._id)}
                                title="Delete"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-tools" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                  <h5 className="mt-3">No maintenance records found</h5>
                  <p className="text-muted">Try adjusting your filters or schedule new maintenance.</p>
                  <Link to="/add-maintenance" className="btn btn-primary">
                    <i className="bi bi-plus-circle me-2"></i>
                    Schedule Maintenance
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceList;
