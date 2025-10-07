// src/services/recipeAPI.js - Future API integration

// This file demonstrates how you would integrate with a real recipe API
// For now, we're using local data, but this shows the structure for future expansion

// Example API endpoints you could use:
// - TheMealDB: https://www.themealdb.com/api.php
// - Spoonacular: https://spoonacular.com/food-api
// - Edamam Recipe API: https://developer.edamam.com/

const API_BASE_URL = 'https://api.example-recipe-service.com';
const API_KEY = 'your-api-key-here'; // Store in environment variables in real apps

/**
 * Search for recipes by query
 * @param {string} query - Search term
 * @param {number} limit - Number of results to return
 * @returns {Promise<Array>} Array of recipe objects
 */
export const searchRecipes = async (query, limit = 12) => {
  try {
    // This is how you would make a real API call:
    /*
    const response = await fetch(`${API_BASE_URL}/recipes/search?q=${query}&limit=${limit}&apikey=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
    */

    // For now, we're returning sample data
    // In a real app, remove this and uncomment the API call above
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            title: "Sample Recipe",
            image: "https://example.com/image.jpg",
            cookTime: "30 mins",
            difficulty: "Medium",
            rating: 4.5,
            ingredients: ["Ingredient 1", "Ingredient 2"],
            description: "Sample description"
          }
        ]);
      }, 500);
    });

  } catch (error) {
    console.error('Error searching recipes:', error);
    throw new Error('Failed to search recipes. Please try again.');
  }
};

/**
 * Get recipe details by ID
 * @param {string|number} id - Recipe ID
 * @returns {Promise<Object>} Recipe object with full details
 */
export const getRecipeById = async (id) => {
  try {
    // Real API call would be:
    // const response = await fetch(`${API_BASE_URL}/recipes/${id}?apikey=${API_KEY}`);
    
    // Sample implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          title: "Detailed Recipe",
          image: "https://example.com/image.jpg",
          cookTime: "30 mins",
          difficulty: "Medium",
          rating: 4.5,
          ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
          instructions: [
            "Step 1: Prepare ingredients",
            "Step 2: Cook according to instructions",
            "Step 3: Serve and enjoy"
          ],
          nutrition: {
            calories: 350,
            protein: "25g",
            carbs: "45g",
            fat: "12g"
          }
        });
      }, 300);
    });

  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw new Error('Failed to load recipe details.');
  }
};

/**
 * Get featured/popular recipes
 * @param {number} limit - Number of recipes to return
 * @returns {Promise<Array>} Array of featured recipe objects
 */
export const getFeaturedRecipes = async (limit = 6) => {
  try {
    // Real implementation would fetch from API
    // For demo purposes, return our sample data
    const featuredRecipes = [
      {
        id: 1,
        title: "Spaghetti Carbonara",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
        cookTime: "20 mins",
        difficulty: "Easy",
        rating: 4.8,
        ingredients: ["Spaghetti", "Eggs", "Parmesan", "Pancetta", "Black Pepper"],
        description: "Classic Italian pasta dish with creamy egg-based sauce",
        featured: true
      },
      // ... more recipes
    ];

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(featuredRecipes.slice(0, limit));
      }, 200);
    });

  } catch (error) {
    console.error('Error fetching featured recipes:', error);
    throw new Error('Failed to load featured recipes.');
  }
};

// Utility functions for API integration

/**
 * Format recipe data from API response
 * @param {Object} apiRecipe - Raw recipe data from API
 * @returns {Object} Formatted recipe object
 */
export const formatRecipeData = (apiRecipe) => {
  return {
    id: apiRecipe.id,
    title: apiRecipe.title || apiRecipe.name,
    image: apiRecipe.image || apiRecipe.imageUrl,
    cookTime: apiRecipe.readyInMinutes ? `${apiRecipe.readyInMinutes} mins` : apiRecipe.cookTime,
    difficulty: apiRecipe.difficulty || 'Medium',
    rating: apiRecipe.spoonacularScore ? (apiRecipe.spoonacularScore / 20).toFixed(1) : 4.5,
    ingredients: apiRecipe.extendedIngredients?.map(ing => ing.original) || apiRecipe.ingredients,
    description: apiRecipe.summary?.replace(/<[^>]*>/g, '') || apiRecipe.description
  };
};

/**
 * Handle API errors gracefully
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error) => {
  if (error.name === 'NetworkError' || !navigator.onLine) {
    return 'No internet connection. Please check your network.';
  }
  
  if (error.message.includes('401')) {
    return 'API authentication failed. Please check your API key.';
  }
  
  if (error.message.includes('429')) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  
  if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  }
  
  return 'Something went wrong. Please try again.';
};

// Example of how to use environment variables (for production apps)
// const getApiKey = () => {
//   return process.env.REACT_APP_RECIPE_API_KEY || 'demo-key';
// };

export default {
  searchRecipes,
  getRecipeById,
  getFeaturedRecipes,
  formatRecipeData,
  handleApiError
};