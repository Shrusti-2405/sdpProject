import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryAPI } from '../services/api';

const Home = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    categories: 0,
    lowStockItems: 0,
    expiringItems: 0
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await inventoryAPI.getAllItems();
      const items = response.data.data;
      
      // Calculate stats
      const categories = [...new Set(items.map(item => item.category))];
      const lowStockItems = items.filter(item => item.quantity <= 2);
      const today = new Date();
      const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
      const expiringItems = items.filter(item => {
        if (!item.expiryDate) return false;
        const expiryDate = new Date(item.expiryDate);
        return expiryDate <= threeDaysFromNow;
      });

      setStats({
        totalItems: items.length,
        categories: categories.length,
        lowStockItems: lowStockItems.length,
        expiringItems: expiringItems.length
      });

      // Get recent items (last 5)
      const sortedItems = items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentItems(sortedItems.slice(0, 5));
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
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
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="jumbotron bg-light p-5 rounded">
            <h1 className="display-4">Welcome to Kitchen Inventory</h1>
            <p className="lead">
              Manage your kitchen ingredients efficiently and get AI-powered recipe suggestions
            </p>
            <hr className="my-4" />
            <p>Track your inventory, discover new recipes, and never run out of ingredients again!</p>
            <Link className="btn btn-primary btn-lg me-3" to="/inventory" role="button">
              View Inventory
            </Link>
            <Link className="btn btn-success btn-lg" to="/recipe-suggestions" role="button">
              Get Recipe Ideas
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">Total Items</h5>
                  <h2>{stats.totalItems}</h2>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-box-seam" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-white bg-info">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">Categories</h5>
                  <h2>{stats.categories}</h2>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-tags" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">Low Stock</h5>
                  <h2>{stats.lowStockItems}</h2>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-white bg-danger">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="card-title">Expiring Soon</h5>
                  <h2>{stats.expiringItems}</h2>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-calendar-x" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Items and Quick Actions */}
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Items</h5>
              <Link to="/inventory" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {recentItems.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Category</th>
                        <th>Expiry Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentItems.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>
                            <span className={`badge ${item.quantity <= 2 ? 'bg-warning' : 'bg-success'}`}>
                              {item.quantity} {item.unit}
                            </span>
                          </td>
                          <td>{item.category}</td>
                          <td>
                            {item.expiryDate ? 
                              new Date(item.expiryDate).toLocaleDateString() : 
                              'N/A'
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No items in inventory yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/add-item" className="btn btn-success">
                  <i className="bi bi-plus-circle me-2"></i>
                  Add New Item
                </Link>
                <Link to="/recipe-suggestions" className="btn btn-info">
                  <i className="bi bi-lightbulb me-2"></i>
                  Get Recipe Ideas
                </Link>
                <Link to="/recipe-chat" className="btn btn-warning">
                  <i className="bi bi-chat-dots me-2"></i>
                  Recipe Chat Bot
                </Link>
                <Link to="/inventory" className="btn btn-outline-primary">
                  <i className="bi bi-list-ul me-2"></i>
                  Manage Inventory
                </Link>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="card mt-3">
            <div className="card-header">
              <h5 className="mb-0">💡 Tips</h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <small>
                    <strong>Keep track:</strong> Regular inventory updates help get better recipes
                  </small>
                </li>
                <li className="mb-2">
                  <small>
                    <strong>Expiry alerts:</strong> Check items expiring in next 3 days
                  </small>
                </li>
                <li>
                  <small>
                    <strong>Smart shopping:</strong> Use missing ingredients feature for Zepto orders
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