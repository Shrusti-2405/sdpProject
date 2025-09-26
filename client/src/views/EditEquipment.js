import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { equipmentAPI } from '../services/api';

const EditEquipment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    category: '',
    status: 'Operational',
    location: '',
    department: '',
    manufacturer: '',
    model: '',
    purchaseDate: '',
    warrantyExpiry: '',
    maintenanceInterval: 30,
    criticality: 'Medium',
    specifications: {},
    notes: ''
  });

  const categories = [
    'Diagnostic', 'Therapeutic', 'Surgical', 'Monitoring', 'Life Support',
    'Imaging', 'Laboratory', 'Rehabilitation', 'Emergency', 'Other'
  ];

  const statuses = [
    'Operational', 'Maintenance', 'Out of Service', 'Repair', 'Retired'
  ];

  const criticalityLevels = [
    'Critical', 'High', 'Medium', 'Low'
  ];

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      const response = await equipmentAPI.getEquipmentById(id);
      const equipment = response.data.data;
      
      setFormData({
        name: equipment.name || '',
        serialNumber: equipment.serialNumber || '',
        category: equipment.category || '',
        status: equipment.status || 'Operational',
        location: equipment.location || '',
        department: equipment.department || '',
        manufacturer: equipment.manufacturer || '',
        model: equipment.model || '',
        purchaseDate: equipment.purchaseDate ? new Date(equipment.purchaseDate).toISOString().split('T')[0] : '',
        warrantyExpiry: equipment.warrantyExpiry ? new Date(equipment.warrantyExpiry).toISOString().split('T')[0] : '',
        maintenanceInterval: equipment.maintenanceInterval || 30,
        criticality: equipment.criticality || 'Medium',
        specifications: equipment.specifications || {},
        notes: equipment.notes || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      alert('Error loading equipment data');
      navigate('/equipment');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecificationChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  const addSpecification = () => {
    const key = prompt('Enter specification name:');
    if (key) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [key]: ''
        }
      }));
    }
  };

  const removeSpecification = (key) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return {
        ...prev,
        specifications: newSpecs
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Convert date strings to Date objects
      const equipmentData = {
        ...formData,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : null,
        warrantyExpiry: formData.warrantyExpiry ? new Date(formData.warrantyExpiry) : null,
        maintenanceInterval: parseInt(formData.maintenanceInterval)
      };

      await equipmentAPI.updateEquipment(id, equipmentData);
      navigate('/equipment');
    } catch (error) {
      console.error('Error updating equipment:', error);
      alert('Error updating equipment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
              <i className="bi bi-pencil-square me-2"></i>
              Edit Equipment
            </h2>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate('/equipment')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Equipment
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Equipment Information</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Basic Information */}
                  <div className="col-md-6">
                    <label className="form-label">Equipment Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Serial Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Location *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Department *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Manufacturer *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Model *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Purchase Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Warranty Expiry</label>
                    <input
                      type="date"
                      className="form-control"
                      name="warrantyExpiry"
                      value={formData.warrantyExpiry}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Maintenance Interval (days)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="maintenanceInterval"
                      value={formData.maintenanceInterval}
                      onChange={handleChange}
                      min="1"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Criticality</label>
                    <select
                      className="form-select"
                      name="criticality"
                      value={formData.criticality}
                      onChange={handleChange}
                    >
                      {criticalityLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-control"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>
                </div>

                {/* Specifications */}
                <div className="mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6>Specifications</h6>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={addSpecification}
                    >
                      <i className="bi bi-plus me-1"></i>
                      Add Specification
                    </button>
                  </div>
                  
                  {Object.keys(formData.specifications).map(key => (
                    <div key={key} className="row g-2 mb-2">
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          value={key}
                          disabled
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          value={formData.specifications[key]}
                          onChange={(e) => handleSpecificationChange(key, e.target.value)}
                          placeholder="Enter value"
                        />
                      </div>
                      <div className="col-md-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeSpecification(key)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Update Equipment
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary ms-2"
                    onClick={() => navigate('/equipment')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">💡 Tips</h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <small>
                    <strong>Status Updates:</strong> Keep equipment status current for accurate tracking
                  </small>
                </li>
                <li className="mb-2">
                  <small>
                    <strong>Maintenance Interval:</strong> Adjust based on usage and manufacturer recommendations
                  </small>
                </li>
                <li className="mb-2">
                  <small>
                    <strong>Criticality:</strong> Update if equipment importance changes
                  </small>
                </li>
                <li className="mb-2">
                  <small>
                    <strong>Specifications:</strong> Keep technical details up to date
                  </small>
                </li>
                <li>
                  <small>
                    <strong>Notes:</strong> Document any important information or changes
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

export default EditEquipment;
