const axios = require('axios');
const inventoryModel = require('../models/inventoryModel');

class RecipeController {
  // Get recipe suggestions based on available inventory
  async getRecipeSuggestions(req, res) {
    try {
      const inventory = inventoryModel.getAllItems();
      
      if (inventory.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No items in inventory to generate recipes'
        });
      }

      // Prepare inventory list for the AI
      const inventoryList = inventory.map(item => 
        `${item.name} (${item.quantity} ${item.unit})`
      ).join(', ');

      const prompt = `Based on the following kitchen inventory: ${inventoryList}. 
      Please suggest 3-5 possible recipes I can make with these ingredients. 
      For each recipe, also mention if any additional ingredients are needed.
      Format the response as JSON with the following structure:
      {
        "recipes": [
          {
            "name": "Recipe Name",
            "description": "Brief description",
            "availableIngredients": ["ingredient1", "ingredient2"],
            "missingIngredients": ["ingredient3", "ingredient4"],
            "instructions": "Brief cooking instructions"
          }
        ]
      }`;

      // Call OpenWebUI API
      const response = await axios.post(
        `${process.env.OPENWEBUI_API_URL}/api/chat/completions`,
        {
          model: "llama3.1:latest", // Adjust model name as needed
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENWEBUI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      let recipes;
      const aiResponse = response.data.choices[0].message.content;
      
      try {
        // Clean the response and try to parse JSON
        let cleanedResponse = aiResponse
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();
        
        const parsedResponse = JSON.parse(cleanedResponse);
        
        // Validate the structure and extract recipes
        if (parsedResponse.recipes && Array.isArray(parsedResponse.recipes)) {
          recipes = parsedResponse;
        } else {
          throw new Error('Invalid recipe structure');
        }
      } catch (parseError) {
        console.log('JSON parsing failed, creating structured response from text');
        
        // Extract recipe information from the text response using regex or text parsing
        const recipeMatches = aiResponse.match(/"name":\s*"([^"]+)"/g) || [];
        const descriptionMatches = aiResponse.match(/"description":\s*"([^"]+)"/g) || [];
        const instructionMatches = aiResponse.match(/"instructions":\s*"([^"]+)"/g) || [];
        
        // Create structured recipes from the matches
        const extractedRecipes = [];
        const maxRecipes = Math.max(recipeMatches.length, 1);
        
        for (let i = 0; i < maxRecipes; i++) {
          const recipeName = recipeMatches[i] 
            ? recipeMatches[i].match(/"name":\s*"([^"]+)"/)[1] 
            : `Recipe ${i + 1}`;
            
          const recipeDescription = descriptionMatches[i] 
            ? descriptionMatches[i].match(/"description":\s*"([^"]+)"/)[1] 
            : "A delicious recipe based on your available ingredients";
            
          const recipeInstructions = instructionMatches[i] 
            ? instructionMatches[i].match(/"instructions":\s*"([^"]+)"/)[1] 
            : "Mix your available ingredients and cook according to your preference";
        
          extractedRecipes.push({
            name: recipeName,
            description: recipeDescription,
            availableIngredients: inventory.slice(0, 3).map(item => item.name),
            missingIngredients: ["Salt", "Pepper", "Oil"],
            instructions: recipeInstructions
          });
        }
        
        // If no recipes were extracted, create a default one
        if (extractedRecipes.length === 0) {
          extractedRecipes.push({
            name: "Simple Recipe",
            description: "A recipe suggestion based on your inventory",
            availableIngredients: inventory.slice(0, 3).map(item => item.name),
            missingIngredients: ["Salt", "Pepper", "Oil"],
            instructions: "Cook your available ingredients together to create a delicious meal. Season with salt and pepper to taste."
          });
        }
        
        recipes = { recipes: extractedRecipes };
      }

      res.status(200).json({
        success: true,
        data: recipes,
        inventory: inventory
      });

    } catch (error) {
      console.error('Recipe API Error:', error.message);
      
      // Enhanced fallback response if API fails
      const inventory = inventoryModel.getAllItems();
      const availableIngredients = inventory.map(item => item.name);
      
      const fallbackRecipes = {
        recipes: [
          {
            name: "Simple Tomato Rice",
            description: "A quick and easy one-pot meal with available ingredients",
            availableIngredients: availableIngredients.slice(0, 3),
            missingIngredients: ["Salt", "Oil", "Onion"],
            instructions: "Heat oil in a pan, add rice and tomatoes. Cook until rice is tender. Season with salt and serve hot."
          },
          {
            name: "Chicken Stir Fry",
            description: "A healthy and quick stir fry with your available proteins and vegetables",
            availableIngredients: availableIngredients,
            missingIngredients: ["Soy Sauce", "Garlic", "Ginger"],
            instructions: "Heat oil in a wok, add chicken and cook until done. Add vegetables and stir fry for 3-4 minutes. Season and serve."
          }
        ]
      };

      res.status(200).json({
        success: true,
        data: fallbackRecipes,
        inventory: inventory,
        message: 'Using fallback recipes due to API unavailability'
      });
    }
  }

  // Chat with AI about recipes
  async chatAboutRecipes(req, res) {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({
          success: false,
          message: 'Message is required'
        });
      }

      const inventory = inventoryModel.getAllItems();
      const inventoryContext = inventory.map(item => 
        `${item.name} (${item.quantity} ${item.unit})`
      ).join(', ');

      const contextualPrompt = `Current kitchen inventory: ${inventoryContext}. 
      User question: ${message}
      
      Please provide helpful cooking advice, recipe suggestions, or answer the user's question 
      keeping in mind the available ingredients.`;

      const response = await axios.post(
        `${process.env.OPENWEBUI_API_URL}/api/chat/completions`,
        {
          model: "llama3.2:latest",
          messages: [
            {
              role: "user",
              content: contextualPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENWEBUI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponse = response.data.choices[0].message.content;

      res.status(200).json({
        success: true,
        response: aiResponse,
        inventory: inventory
      });

    } catch (error) {
      console.error('Chat API Error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error processing chat request',
        error: error.message
      });
    }
  }

  // Check missing ingredients and suggest Zepto order
  checkMissingIngredients(req, res) {
    try {
      const { recipeIngredients } = req.body;
      
      if (!recipeIngredients || !Array.isArray(recipeIngredients)) {
        return res.status(400).json({
          success: false,
          message: 'Recipe ingredients array is required'
        });
      }

      const inventory = inventoryModel.getAllItems();
      const availableItems = inventory.map(item => item.name.toLowerCase());
      
      const missingIngredients = recipeIngredients.filter(ingredient => 
        !availableItems.some(item => 
          item.includes(ingredient.toLowerCase()) || 
          ingredient.toLowerCase().includes(item)
        )
      );

      const zeptoOrderSuggestion = {
        missingIngredients,
        canOrderFromZepto: missingIngredients.length > 0,
        orderUrl: missingIngredients.length > 0 ? 
          `https://www.zeptonow.com/search?query=${missingIngredients.join('+')}&utm_source=kitchen_app` : 
          null
      };

      res.status(200).json({
        success: true,
        data: zeptoOrderSuggestion,
        availableIngredients: recipeIngredients.filter(ingredient => 
          availableItems.some(item => 
            item.includes(ingredient.toLowerCase()) || 
            ingredient.toLowerCase().includes(item)
          )
        )
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error checking missing ingredients',
        error: error.message
      });
    }
  }
}

module.exports = new RecipeController();