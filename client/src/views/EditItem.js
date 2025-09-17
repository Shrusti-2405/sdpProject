import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { inventoryAPI } from '../services/api';
import ItemForm from '../components/Inventory/ItemForm';

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getItemById(id);
      const itemData = response.data.data;
      
      // Format date for input field
      if (itemData.expiryDate) {
        itemData.expiryDate = new Date(itemData.expiryDate).toISOString().split('T')[0];
      }
      
      setItem(itemData);
      setError('');
    } catch (err) {
      setError('Failed to fetch item details');
      console.error('Error fetching item:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError('');
      
      await inventoryAPI.updateItem(id, formData);
      
      // Redirect to inventory list with success message
      navigate('/inventory', { 
        state: { message: 'Item updated successfully!' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item');
      console.error('Error updating item:', err);
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

  if (error && !item) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Edit Item</h3>
              <p className="text-muted mb-0">Update item details in your kitchen inventory</p>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {item && (
                <ItemForm
                  initialData={item}
                  onSubmit={handleSubmit}
                  loading={saving}
                  submitText="Update Item"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditItem;