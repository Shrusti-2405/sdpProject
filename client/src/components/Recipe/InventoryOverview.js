import React from 'react';
import { Link } from 'react-router-dom';

const InventoryOverview = ({ inventory }) => {
  const groupedByCategory = inventory.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const getStockStatusColor = (quantity) => {
    if (quantity <= 1) return 'text-danger';
    if (quantity <= 2) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="card sticky-top" style={{ top: '20px' }}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Current Inventory</h5>
        <Link to="/inventory" className="btn btn-sm btn-outline-primary">
          Manage
        </Link>
      </div>
      <div className="card-body">
        {inventory.length === 0 ? (
          <div className="text-center py-3">
            <i className="bi bi-inbox display-4 text-muted"></i>
            <p className="text-muted mt-2">No items in inventory</p>
            <Link to="/add-item" className="btn btn-sm btn-primary">
              Add Items
            </Link>
          </div>
        ) : (
          <div className="accordion accordion-flush" id="inventoryAccordion">
            {Object.entries(groupedByCategory).map(([category, items], index) => (
              <div key={category} className="accordion-item">
                <h2 className="accordion-header" id={`heading${index}`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${index}`}
                    aria-expanded="false"
                    aria-controls={`collapse${index}`}
                  >
                    <div className="d-flex justify-content-between w-100 me-3">
                      <span>{category}</span>
                      <span className="badge bg-secondary">{items.length}</span>
                    </div>
                  </button>
                </h2>
                <div
                  id={`collapse${index}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading${index}`}
                  data-bs-parent="#inventoryAccordion"
                >
                  <div className="accordion-body p-2">
                    {items.map((item) => (
                      <div key={item.id} className="d-flex justify-content-between align-items-center py-1 px-2 rounded hover-bg-light">
                        <div className="flex-grow-1">
                          <div className="fw-medium">{item.name}</div>
                          {item.expiryDate && (
                            <small className="text-muted">
                              Expires: {new Date(item.expiryDate).toLocaleDateString()}
                            </small>
                          )}
                        </div>
                        <span className={`fw-bold ${getStockStatusColor(item.quantity)}`}>
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {inventory.length > 0 && (
        <div className="card-footer">
          <div className="row text-center">
            <div className="col-6">
              <small className="text-muted">Total Items</small>
              <div className="fw-bold">{inventory.length}</div>
            </div>
            <div className="col-6">
              <small className="text-muted">Categories</small>
              <div className="fw-bold">{Object.keys(groupedByCategory).length}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryOverview;