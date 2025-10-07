// src/components/RecipeList.jsx - List container with loading states
import RecipeCard from './RecipeCard';

function RecipeList({ recipes, loading, searchTerm }) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Searching for delicious recipes...</p>
      </div>
    );
  }

  if (recipes.length === 0 && searchTerm) {
    return (
      <div className="no-results">
        <div className="no-results-icon">🔍</div>
        <h3>No recipes found</h3>
        <p>Try searching for different ingredients or dish names</p>
        <p>Popular searches: "pasta", "chicken", "vegetarian", "dessert"</p>
      </div>
    );
  }

  return (
    <div className="recipe-list">
      <div className="list-header">
        <h2>
          {searchTerm 
            ? `Search Results for "${searchTerm}" (${recipes.length})`
            : `Featured Recipes (${recipes.length})`
          }
        </h2>
      </div>
      
      <div className="recipe-grid">
        {recipes.map(recipe => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe}
          />
        ))}
      </div>
    </div>
  );
}

export default RecipeList;