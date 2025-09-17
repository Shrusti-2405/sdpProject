import React, { useState } from 'react';
import { recipeAPI } from '../../services/api';

const RecipeCard = ({ recipe, inventory }) => {
  const [showFullInstructions, setShowFullInstructions] = useState(false);
  const [loadingZepto, setLoadingZepto] = useState(false);
  const [zeptoInfo, setZeptoInfo] = useState(null);

  // Parse raw JSON response if needed
  const parseRecipeData = (recipeData) => {
    // If it's already an object, return as is
    if (typeof recipeData === 'object' && recipeData.name) {
      return recipeData;
    }

    // If it's a string that looks like JSON, try to parse it
    if (typeof recipeData === 'string') {
      try {
        const parsed = JSON.parse(recipeData);
        if (parsed.recipes && Array.isArray(parsed.recipes) && parsed.recipes.length > 0) {
          return parsed.recipes[0]; // Return first recipe
        }
      } catch (e) {
        // If parsing fails, create a simple recipe object
        return {
          name: 'Recipe Suggestion',
          description: 'AI-generated recipe based on your ingredients',
          instructions: recipeData,
          availableIngredients: inventory.slice(0, 3).map(item => item.name),
          missingIngredients: ['Salt', 'Pepper', 'Oil']
        };
      }
    }

    return recipeData;
  };

  const parsedRecipe = parseRecipeData(recipe);

  const handleOrderMissing = async () => {
    const missingIngredients = parsedRecipe.missingIngredients || [];
    
    if (missingIngredients.length === 0) {
      return;
    }

    try {
      setLoadingZepto(true);
      const response = await recipeAPI.checkMissingIngredients(missingIngredients);
      
      if (response.data.success) {
        setZeptoInfo(response.data.data);
        
        // Open Zepto with the missing ingredients
        if (response.data.data.orderUrl) {
          window.open(response.data.data.orderUrl, '_blank');
        }
      }
    } catch (error) {
      console.error('Error checking missing ingredients:', error);
    } finally {
      setLoadingZepto(false);
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text || '';
    return text.substr(0, maxLength) + '...';
  };

  const formatInstructions = (instructions) => {
    if (!instructions) return 'No instructions available';
    
    // Clean up JSON-like text and format it nicely
    let cleanText = instructions
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n');

    // If it's still a JSON string, try to extract readable content
    try {
      const jsonData = JSON.parse(cleanText);
      if (jsonData.recipes) {
        return jsonData.recipes.map(r => r.instructions || r.description || '').join(' ');
      }
    } catch (e) {
      // If not JSON, return cleaned text
      return cleanText;
    }

    return cleanText;
  };

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-header bg-light">
        <h5 className="card-title mb-1">{parsedRecipe.name || 'Recipe Suggestion'}</h5>
        <p className="text-muted mb-0 small">{parsedRecipe.description || 'AI-generated recipe based on your ingredients'}</p>
      </div>
      
      <div className="card-body">
        {/* Available Ingredients */}
        {parsedRecipe.availableIngredients && parsedRecipe.availableIngredients.length > 0 && (
          <div className="mb-3">
            <h6 className="text-success">
              <i className="bi bi-check-circle me-2"></i>
              Available Ingredients
            </h6>
            <div className="d-flex flex-wrap gap-1">
              {parsedRecipe.availableIngredients.map((ingredient, index) => (
                <span key={index} className="badge bg-success">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Ingredients */}
        {parsedRecipe.missingIngredients && parsedRecipe.missingIngredients.length > 0 && (
          <div className="mb-3">
            <h6 className="text-warning">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Missing Ingredients
            </h6>
            <div className="d-flex flex-wrap gap-1 mb-2">
              {parsedRecipe.missingIngredients.map((ingredient, index) => (
                <span key={index} className="badge bg-warning text-dark">
                  {ingredient}
                </span>
              ))}
            </div>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={handleOrderMissing}
              disabled={loadingZepto}
            >
              {loadingZepto ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Checking Zepto...
                </>
              ) : (
                <>
                  <i className="bi bi-cart me-2"></i>
                  Order from Zepto
                </>
              )}
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mb-3">
          <h6 className="text-primary">
            <i className="bi bi-list-ol me-2"></i>
            Instructions
          </h6>
          <div className="bg-light rounded p-3">
            <p className="text-muted mb-0" style={{ whiteSpace: 'pre-wrap' }}>
              {showFullInstructions ? 
                formatInstructions(parsedRecipe.instructions) : 
                truncateText(formatInstructions(parsedRecipe.instructions))
              }
            </p>
            {formatInstructions(parsedRecipe.instructions).length > 150 && (
              <button
                className="btn btn-sm btn-link p-0 mt-2"
                onClick={() => setShowFullInstructions(!showFullInstructions)}
              >
                {showFullInstructions ? (
                  <>
                    <i className="bi bi-chevron-up me-1"></i>
                    Show Less
                  </>
                ) : (
                  <>
                    <i className="bi bi-chevron-down me-1"></i>
                    Show More
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Zepto Order Info */}
        {zeptoInfo && (
          <div className="alert alert-info small">
            <strong>Zepto Order Info:</strong>
            <ul className="mb-0 mt-1">
              {zeptoInfo.missingIngredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="card-footer bg-light">
        <div className="row text-center">
          <div className="col-6">
            <small className="text-muted">Available</small>
            <div className="fw-bold text-success">
              {parsedRecipe.availableIngredients ? parsedRecipe.availableIngredients.length : 0}
            </div>
          </div>
          <div className="col-6">
            <small className="text-muted">Missing</small>
            <div className="fw-bold text-warning">
              {parsedRecipe.missingIngredients ? parsedRecipe.missingIngredients.length : 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;