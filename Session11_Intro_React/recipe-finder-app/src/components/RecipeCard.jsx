// src/components/RecipeCard.jsx - Individual recipe display
import { useState } from 'react';

function RecipeCard({ recipe }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleViewRecipe = () => {
    alert(`Opening full recipe for: ${recipe.title}\n\nIngredients: ${recipe.ingredients.join(', ')}\n\nThis would normally open a detailed recipe page!`);
  };

  return (
    <div 
      className={`recipe-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Recipe Image */}
      <div className="recipe-image">
        {!imageLoaded && (
          <div className="image-placeholder">
            <span>🍳</span>
          </div>
        )}
        <img 
          src={recipe.image} 
          alt={recipe.title}
          onLoad={handleImageLoad}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
        <div className="recipe-rating">
          ⭐ {recipe.rating}
        </div>
      </div>

      {/* Recipe Info */}
      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.title}</h3>
        <p className="recipe-description">{recipe.description}</p>
        
        {/* Recipe Meta */}
        <div className="recipe-meta">
          <span className="cook-time">
            🕒 {recipe.cookTime}
          </span>
          <span 
            className="difficulty"
            style={{ color: getDifficultyColor(recipe.difficulty) }}
          >
            📊 {recipe.difficulty}
          </span>
        </div>

        {/* Ingredients Preview */}
        <div className="ingredients-preview">
          <h4>Key Ingredients:</h4>
          <div className="ingredients-tags">
            {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
              <span key={index} className="ingredient-tag">
                {ingredient}
              </span>
            ))}
            {recipe.ingredients.length > 3 && (
              <span className="more-ingredients">
                +{recipe.ingredients.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button 
          className="view-recipe-btn"
          onClick={handleViewRecipe}
        >
          👀 View Full Recipe
        </button>
      </div>
    </div>
  );
}

export default RecipeCard;