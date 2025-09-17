const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// GET /api/recipes/suggestions - Get recipe suggestions based on inventory
router.get('/suggestions', recipeController.getRecipeSuggestions);

// POST /api/recipes/chat - Chat with AI about recipes
router.post('/chat', recipeController.chatAboutRecipes);

// POST /api/recipes/missing-ingredients - Check missing ingredients for Zepto order
router.post('/missing-ingredients', recipeController.checkMissingIngredients);

module.exports = router;