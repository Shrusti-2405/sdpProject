import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryAPI } from '../services/api';
import ItemForm from '../components/Inventory/ItemForm';

const AddItem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      
      await inventoryAPI.createItem(formData);
      
      // Redirect to inventory list with success message
      navigate('/inventory', { 
        state: { message: 'Item added successfully!' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item');
      console.error('Error adding item:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Add New Item</h3>
              <p className="text-muted mb-0">Add a new item to your kitchen inventory</p>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <ItemForm
                onSubmit={handleSubmit}
                loading={loading}
                submitText="Add Item"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItem;