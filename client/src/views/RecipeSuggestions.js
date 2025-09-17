import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipeAPI, inventoryAPI } from '../services/api';
import RecipeCard from '../components/Recipe/RecipeCard';
import InventoryOverview from '../components/Recipe/InventoryOverview';

const RecipeSuggestions = () => {
  const [recipes, setRecipes] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await inventoryAPI.getAllItems();
      setInventory(response.data.data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  };

  const fetchRecipeSuggestions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await recipeAPI.getRecipeSuggestions();
      const data = response.data;
      
      if (data.success && data.data.recipes) {
        setRecipes(data.data.recipes);
      } else {
        setError('No recipes found. Try adding more items to your inventory.');
      }
    } catch (err) {
      setError('Failed to get recipe suggestions. Please try again later.');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-md-8">
          <h2>Recipe Suggestions</h2>
          <p className="text-muted">
            Get AI-powered recipe suggestions based on your current inventory
          </p>
        </div>
        <div className="col-md-4 text-end">
          <button
            className="btn btn-primary"
            onClick={fetchRecipeSuggestions}
            disabled={loading || inventory.length === 0}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Getting Recipes...
              </>
            ) : (
              <>
                <i className="bi bi-lightbulb me-2"></i>
                Get Recipe Ideas
              </>
            )}
          </button>
        </div>
      </div>

      {inventory.length === 0 && (
        <div className="alert alert-warning" role="alert">
          <h5 className="alert-heading">No items in inventory!</h5>
          <p>You need to add some items to your kitchen inventory first to get recipe suggestions.</p>
          <hr />
          <Link to="/add-item" className="btn btn-warning">
            Add Items to Inventory
          </Link>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row">
        {/* Inventory Overview Sidebar */}
        <div className="col-md-4">
          <InventoryOverview inventory={inventory} />
        </div>

        {/* Recipe Suggestions */}
        <div className="col-md-8">
          {recipes.length > 0 ? (
            <div className="row">
              {recipes.map((recipe, index) => (
                <div key={index} className="col-12 mb-4">
                  <RecipeCard recipe={recipe} inventory={inventory} />
                </div>
              ))}
            </div>
          ) : (
            !loading && inventory.length > 0 && (
              <div className="card">
                <div className="card-body text-center py-5">
                  <i className="bi bi-book display-1 text-muted"></i>
                  <h3 className="mt-3">No Recipes Yet</h3>
                  <p className="text-muted">
                    Click "Get Recipe Ideas" to discover what you can cook with your current inventory!
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={fetchRecipeSuggestions}
                    disabled={loading}
                  >
                    <i className="bi bi-lightbulb me-2"></i>
                    Get Recipe Ideas
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeSuggestions;