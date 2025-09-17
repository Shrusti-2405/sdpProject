import React from 'react';
import { Link } from 'react-router-dom';

const InventoryTable = ({ items, onDelete }) => {
  const getStockStatus = (quantity) => {
    if (quantity <= 1) return { class: 'bg-danger', text: 'Critical' };
    if (quantity <= 2) return { class: 'bg-warning', text: 'Low' };
    if (quantity <= 5) return { class: 'bg-info', text: 'Medium' };
    return { class: 'bg-success', text: 'Good' };
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { class: 'text-danger', text: 'Expired' };
    if (diffDays <= 3) return { class: 'text-warning', text: `${diffDays} days` };
    return { class: 'text-success', text: `${diffDays} days` };
  };

  return (
    <div className="card">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const stockStatus = getStockStatus(item.quantity);
                const expiryStatus = getExpiryStatus(item.expiryDate);
                
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="fw-bold">{item.name}</div>
                          <small className="text-muted">
                            Added {new Date(item.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${stockStatus.class}`}>
                        {item.quantity} {item.unit}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{item.category}</span>
                    </td>
                    <td>
                      {item.expiryDate ? (
                        <div>
                          <div>{new Date(item.expiryDate).toLocaleDateString()}</div>
                          {expiryStatus && (
                            <small className={expiryStatus.class}>
                              {expiryStatus.text}
                            </small>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted">No expiry</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${stockStatus.class}`}>
                        {stockStatus.text}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <Link
                          to={`/edit-item/${item.id}`}
                          className="btn btn-outline-primary"
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => onDelete(item.id)}
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;