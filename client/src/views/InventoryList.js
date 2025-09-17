import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryAPI } from '../services/api';
import SearchBar from '../components/Inventory/SearchBar';
import InventoryTable from '../components/Inventory/InventoryTable';
import CategoryFilter from '../components/Inventory/CategoryFilter';

const InventoryList = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchQuery, selectedCategory]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getAllItems();
      const itemsData = response.data.data;
      setItems(itemsData);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(itemsData.map(item => item.category))];
      setCategories(uniqueCategories);
      
      setError('');
    } catch (err) {
      setError('Failed to fetch inventory items');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await inventoryAPI.deleteItem(id);
        setItems(items.filter(item => item.id !== id));
      } catch (err) {
        setError('Failed to delete item');
        console.error('Error deleting item:', err);
      }
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
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
        <div className="col-md-6">
          <h2>Kitchen Inventory</h2>
          <p className="text-muted">Manage all your kitchen items</p>
        </div>
        <div className="col-md-6 text-end">
          <Link to="/add-item" className="btn btn-success">
            <i className="bi bi-plus-circle me-2"></i>
            Add New Item
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="row mb-4">
        <div className="col-md-6">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="col-md-6">
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryFilter}
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted">
              Showing {filteredItems.length} of {items.length} items
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory && ` in "${selectedCategory}"`}
            </span>
            {(searchQuery || selectedCategory) && (
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="row">
        <div className="col-12">
          {filteredItems.length > 0 ? (
            <InventoryTable 
              items={filteredItems} 
              onDelete={handleDelete}
            />
          ) : (
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="bi bi-inbox display-1 text-muted"></i>
                <h3 className="mt-3">No items found</h3>
                <p className="text-muted">
                  {searchQuery || selectedCategory ? 
                    'Try adjusting your search or filter criteria.' :
                    'Start by adding some items to your kitchen inventory.'
                  }
                </p>
                {!searchQuery && !selectedCategory && (
                  <Link to="/add-item" className="btn btn-primary">
                    Add Your First Item
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryList;