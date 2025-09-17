import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ItemForm = ({ 
  initialData = {}, 
  onSubmit, 
  loading = false, 
  submitText = 'Submit' 
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    quantity: initialData.quantity || '',
    unit: initialData.unit || 'pieces',
    category: initialData.category || '',
    expiryDate: initialData.expiryDate || ''
  });

  const [errors, setErrors] = useState({});

  const units = [
    'pieces', 'kg', 'grams', 'liters', 'ml', 'cups', 'tbsp', 'tsp', 'packets', 'bottles'
  ];

  const categories = [
    'Vegetables', 'Fruits', 'Grains', 'Protein', 'Dairy', 'Spices', 'Condiments', 
    'Beverages', 'Snacks', 'Frozen', 'Canned', 'Bakery', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        quantity: parseFloat(formData.quantity)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="name" className="form-label">
            Item Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter item name"
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="category" className="form-label">
            Category <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${errors.category ? 'is-invalid' : ''}`}
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <div className="invalid-feedback">{errors.category}</div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <label htmlFor="quantity" className="form-label">
            Quantity <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="0"
          />
          {errors.quantity && (
            <div className="invalid-feedback">{errors.quantity}</div>
          )}
        </div>

        <div className="col-md-4 mb-3">
          <label htmlFor="unit" className="form-label">Unit</label>
          <select
            className="form-select"
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
          >
            {units.map(unit => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4 mb-3">
          <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
          <input
            type="date"
            className="form-control"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
          />
          <div className="form-text">Optional: Leave empty if no expiry date</div>
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <Link to="/inventory" className="btn btn-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Inventory
        </Link>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Saving...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle me-2"></i>
              {submitText}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ItemForm;