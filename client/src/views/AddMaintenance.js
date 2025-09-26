import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { maintenanceAPI, equipmentAPI } from '../services/api';

const AddMaintenance = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [equipment, setEquipment] = useState([]);
  const [formData, setFormData] = useState({
    equipmentId: '',
    type: 'Preventive',
    status: 'Scheduled',
    scheduledDate: '',
    description: '',
    technician: {
      name: '',
      id: '',
      contact: ''
    },
    priority: 'Medium',
    estimatedDuration: 2,
    cost: 0,
    isRecurring: false,
    recurringInterval: 30,
    notes: ''
  });

  const types = [
    'Preventive', 'Corrective', 'Emergency', 'Inspection', 'Calibration'
  ];

  const priorities = [
    'Low', 'Medium', 'High', 'Critical'
  ];

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await equipmentAPI.getAllEquipment();
      setEquipment(response.data.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTechnicianChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      technician: {
        ...prev.technician,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const maintenanceData = {
        ...formData,
        scheduledDate: new Date(formData.scheduledDate),
        estimatedDuration: parseFloat(formData.estimatedDuration),
        cost: parseFloat(formData.cost),
        recurringInterval: parseInt(formData.recurringInterval)
      };

      if (formData.isRecurring) {
        await maintenanceAPI.scheduleRecurringMaintenance(maintenanceData);
      } else {
        await maintenanceAPI.createMaintenance(maintenanceData);
      }
      
      navigate('/maintenance');
    } catch (error) {
      console.error('Error creating maintenance:', error);
      alert('Error creating maintenance record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2>
              <i className="bi bi-plus-circle me-2"></i>
              Schedule Maintenance
            </h2>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate('/maintenance')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Maintenance
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Maintenance Information</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Equipment Selection */}
                  <div className="col-md-6">
                    <label className="form-label">Equipment *</label>
                    <select
                      className="form-select"
                      name="equipmentId"
                      value={formData.equipmentId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Equipment</option>
                      {equipment.map(item => (
                        <option key={item._id} value={item._id}>
                          {item.name} - {item.serialNumber} ({item.location})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Maintenance Type *</label>
                    <select
                      className="form-select"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                    >
                      {types.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Scheduled Date *</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="scheduledDate"
                      value={formData.scheduledDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      {priorities.map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Description *</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      required
                    />
                  </div>

                  {/* Technician Information */}
                  <div className="col-12">
                    <h6 className="mt-3 mb-3">Technician Information</h6>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Technician Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.technician.name}
                      onChange={handleTechnicianChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Technician ID *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="id"
                      value={formData.technician.id}
                      onChange={handleTechnicianChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Contact *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="contact"
                      value={formData.technician.contact}
                      onChange={handleTechnicianChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Estimated Duration (hours)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="estimatedDuration"
                      value={formData.estimatedDuration}
                      onChange={handleChange}
                      min="0.5"
                      step="0.5"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Estimated Cost</label>
                    <input
                      type="number"
                      className="form-control"
                      name="cost"
                      value={formData.cost}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* Recurring Maintenance */}
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="isRecurring"
                        checked={formData.isRecurring}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          isRecurring: e.target.checked
                        }))}
                      />
                      <label className="form-check-label">
                        Schedule as recurring maintenance
                      </label>
                    </div>
                  </div>

                  {formData.isRecurring && (
                    <div className="col-md-6">
                      <label className="form-label">Recurring Interval (days)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="recurringInterval"
                        value={formData.recurringInterval}
                        onChange={handleChange}
                        min="1"
                      />
                    </div>
                  )}

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

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Schedule Maintenance
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary ms-2"
                    onClick={() => navigate('/maintenance')}
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
                    <strong>Preventive Maintenance:</strong> Schedule regular maintenance to prevent failures
                  </small>
                </li>
                <li className="mb-2">
                  <small>
                    <strong>Priority Levels:</strong> Critical equipment should have higher priority
                  </small>
                </li>
                <li className="mb-2">
                  <small>
                    <strong>Recurring Maintenance:</strong> Use for regular preventive maintenance schedules
                  </small>
                </li>
                <li className="mb-2">
                  <small>
                    <strong>Technician Assignment:</strong> Assign qualified technicians for specific equipment
                  </small>
                </li>
                <li>
                  <small>
                    <strong>Documentation:</strong> Detailed descriptions help technicians prepare better
                  </small>
                </li>
              </ul>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h5 className="mb-0">Maintenance Types</h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <strong>Preventive:</strong> Regular scheduled maintenance
                </li>
                <li className="mb-2">
                  <strong>Corrective:</strong> Fixing identified issues
                </li>
                <li className="mb-2">
                  <strong>Emergency:</strong> Urgent repairs needed
                </li>
                <li className="mb-2">
                  <strong>Inspection:</strong> Visual or functional checks
                </li>
                <li>
                  <strong>Calibration:</strong> Adjusting equipment to standards
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMaintenance;
