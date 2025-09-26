import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { equipmentAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import AnimatedCard from '../components/AnimatedCard';

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await equipmentAPI.getAllEquipment();
      setEquipment(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await equipmentAPI.deleteEquipment(id);
        setEquipment(equipment.filter(item => item._id !== id));
      } catch (error) {
        console.error('Error deleting equipment:', error);
        alert('Error deleting equipment');
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await equipmentAPI.updateEquipmentStatus(id, newStatus);
      setEquipment(equipment.map(item => 
        item._id === id ? { ...item, status: newStatus } : item
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating equipment status');
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

  const getCriticalityBadgeClass = (criticality) => {
    switch (criticality) {
      case 'Critical': return 'bg-danger';
      case 'High': return 'bg-warning';
      case 'Medium': return 'bg-info';
      case 'Low': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesDepartment = !departmentFilter || item.department === departmentFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDepartment;
  });

  const categories = [...new Set(equipment.map(item => item.category))];
  const statuses = [...new Set(equipment.map(item => item.status))];
  const departments = [...new Set(equipment.map(item => item.department))];

  if (loading) {
    return <LoadingSpinner message="Loading equipment data..." />;
  }

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2>
              <i className="bi bi-gear me-2"></i>
              Equipment Management
            </h2>
            <Link to="/add-equipment" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              Add Equipment
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
                    placeholder="Search equipment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
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
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="">All Departments</option>
                    {departments.map(department => (
                      <option key={department} value={department}>{department}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('');
                      setStatusFilter('');
                      setDepartmentFilter('');
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

      {/* Equipment Table */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                Equipment List ({filteredEquipment.length} items)
              </h5>
            </div>
            <div className="card-body">
              {filteredEquipment.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Serial Number</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Department</th>
                        <th>Location</th>
                        <th>Criticality</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEquipment.map((item) => (
                        <tr key={item._id}>
                          <td>
                            <div>
                              <strong>{item.name}</strong>
                              <br />
                              <small className="text-muted">{item.manufacturer} {item.model}</small>
                            </div>
                          </td>
                          <td>
                            <code>{item.serialNumber}</code>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {item.category}
                            </span>
                          </td>
                          <td>
                            <StatusBadge status={item.status} />
                          </td>
                          <td>{item.department}</td>
                          <td>{item.location}</td>
                          <td>
                            <PriorityBadge priority={item.criticality} />
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Link
                                to={`/edit-equipment/${item._id}`}
                                className="btn btn-sm btn-outline-primary"
                                title="Edit"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <div className="dropdown">
                                <button
                                  className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  title="Status"
                                >
                                  <i className="bi bi-gear"></i>
                                </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => handleStatusUpdate(item._id, 'Operational')}
                                    >
                                      <i className="bi bi-check-circle me-2"></i>
                                      Operational
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => handleStatusUpdate(item._id, 'Maintenance')}
                                    >
                                      <i className="bi bi-tools me-2"></i>
                                      Maintenance
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => handleStatusUpdate(item._id, 'Out of Service')}
                                    >
                                      <i className="bi bi-x-circle me-2"></i>
                                      Out of Service
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => handleStatusUpdate(item._id, 'Repair')}
                                    >
                                      <i className="bi bi-wrench me-2"></i>
                                      Repair
                                    </button>
                                  </li>
                                </ul>
                              </div>
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
                  <i className="bi bi-gear" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                  <h5 className="mt-3">No equipment found</h5>
                  <p className="text-muted">Try adjusting your filters or add new equipment.</p>
                  <Link to="/add-equipment" className="btn btn-primary">
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Equipment
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

export default EquipmentList;
