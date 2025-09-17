import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inventory API calls
export const inventoryAPI = {
  // Get all items
  getAllItems: () => api.get('/inventory'),
  
  // Get item by ID
  getItemById: (id) => api.get(`/inventory/${id}`),
  
  // Create new item
  createItem: (itemData) => api.post('/inventory', itemData),
  
  // Update item
  updateItem: (id, itemData) => api.put(`/inventory/${id}`, itemData),
  
  // Delete item
  deleteItem: (id) => api.delete(`/inventory/${id}`),
  
  // Search items
  searchItems: (query) => api.get(`/inventory/search?q=${query}`),
  
  // Get items by category
  getItemsByCategory: (category) => api.get(`/inventory/category/${category}`)
};

// Recipe API calls
export const recipeAPI = {
  // Get recipe suggestions
  getRecipeSuggestions: () => api.get('/recipes/suggestions'),
  
  // Chat about recipes
  chatAboutRecipes: (message) => api.post('/recipes/chat', { message }),
  
  // Check missing ingredients
  checkMissingIngredients: (ingredients) => 
    api.post('/recipes/missing-ingredients', { recipeIngredients: ingredients })
};

export default api;