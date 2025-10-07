// src/App.jsx - Main Recipe Finder Application
import { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import RecipeList from './components/RecipeList';
import Footer from './components/Footer';
import './App.css';

function App() {
  // State for recipes and UI
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState('light');

  // Sample recipes for demonstration (before API integration)
  const [featuredRecipes] = useState([
    {
      id: 1,
      title: "Spaghetti Carbonara",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
      cookTime: "20 mins",
      difficulty: "Easy",
      rating: 4.8,
      ingredients: ["Spaghetti", "Eggs", "Parmesan", "Pancetta", "Black Pepper"],
      description: "Classic Italian pasta dish with creamy egg-based sauce"
    },
    {
      id: 2,
      title: "Chicken Tikka Masala",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
      cookTime: "45 mins",
      difficulty: "Medium",
      rating: 4.9,
      ingredients: ["Chicken", "Tomatoes", "Cream", "Spices", "Onions"],
      description: "Rich and creamy Indian curry with tender chicken pieces"
    },
    {
      id: 3,
      title: "Avocado Toast",
      image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop",
      cookTime: "5 mins",
      difficulty: "Easy",
      rating: 4.5,
      ingredients: ["Avocado", "Bread", "Lemon", "Salt", "Pepper"],
      description: "Healthy and delicious breakfast option"
    },
    {
      id: 4,
      title: "Chocolate Chip Cookies",
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop",
      cookTime: "25 mins",
      difficulty: "Easy",
      rating: 4.7,
      ingredients: ["Flour", "Butter", "Sugar", "Chocolate Chips", "Eggs"],
      description: "Classic homemade cookies that everyone loves"
    },
    {
      id: 5,
      title: "Caesar Salad",
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
      cookTime: "15 mins",
      difficulty: "Easy",
      rating: 4.4,
      ingredients: ["Romaine", "Croutons", "Parmesan", "Caesar Dressing", "Anchovies"],
      description: "Fresh and crispy salad with tangy Caesar dressing"
    },
    {
      id: 6,
      title: "Beef Tacos",
      image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop",
      cookTime: "30 mins",
      difficulty: "Medium",
      rating: 4.6,
      ingredients: ["Ground Beef", "Tortillas", "Lettuce", "Cheese", "Tomatoes"],
      description: "Flavorful Mexican-style tacos with seasoned beef"
    }
  ]);

  // Handle recipe search
  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setRecipes(featuredRecipes);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Filter featured recipes for now (later we'll use API)
      const filtered = featuredRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      
      // Simulate API delay for realistic experience
      setTimeout(() => {
        setRecipes(filtered);
        setLoading(false);
      }, 800);
      
    } catch (err) {
      setError('Failed to search recipes. Please try again.');
      setLoading(false);
    }
  };

  // Load featured recipes on app start
  useEffect(() => {
    setRecipes(featuredRecipes);
  }, [featuredRecipes]);

  // Theme toggle functionality
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className={`app ${theme}`}>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      
      <main className="main-content">
        <section className="hero">
          <div className="hero-content">
            <h1>🍳 Discover Amazing Recipes</h1>
            <p>Find and explore delicious recipes from around the world</p>
            <SearchBar 
              onSearch={handleSearch}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
            />
          </div>
        </section>

        <section className="recipes-section">
          <div className="container">
            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={() => setError(null)}>Try Again</button>
              </div>
            )}
            
            <RecipeList 
              recipes={recipes}
              loading={loading}
              searchTerm={searchTerm}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;