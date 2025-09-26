import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card mt-5">
                <div className="card-header bg-danger text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Something went wrong
                  </h5>
                </div>
                <div className="card-body text-center">
                  <div className="mb-4">
                    <i className="bi bi-bug" style={{ fontSize: '4rem', color: '#dc3545' }}></i>
                  </div>
                  <h4>Oops! An error occurred</h4>
                  <p className="text-muted">
                    We're sorry, but something went wrong. Please try refreshing the page.
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => window.location.reload()}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refresh Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
