import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import recipeService from '../services/api/recipeService';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const navigate = useNavigate();

  const filters = [
    { id: 'all', label: 'All Recipes', icon: 'ChefHat' },
    { id: 'quick', label: 'Quick (< 30 min)', icon: 'Clock' },
    { id: 'lowcal', label: 'Low Calorie (< 300)', icon: 'Heart' },
    { id: 'protein', label: 'High Protein', icon: 'Zap' }
  ];

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchTerm, selectedFilter]);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const data = await recipeService.getAll();
      setRecipes(data);
    } catch (error) {
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = [...recipes];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ingredient =>
          ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply category filter
    switch (selectedFilter) {
      case 'quick':
        filtered = filtered.filter(recipe => recipe.prepTime + recipe.cookTime < 30);
        break;
      case 'lowcal':
        filtered = filtered.filter(recipe => recipe.calories < 300);
        break;
      case 'protein':
        filtered = filtered.filter(recipe => recipe.protein > 20);
        break;
      default:
        break;
    }

    setFilteredRecipes(filtered);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-full overflow-hidden">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-full overflow-hidden"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Recipe Collection</h1>
          <p className="text-gray-600">Discover healthy and delicious recipes for your meal plans</p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipes or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedFilter === filter.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ApperIcon name={filter.icon} className="w-4 h-4" />
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Recipe Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200"
              >
                {/* Recipe Image */}
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <ApperIcon name="ChefHat" className="w-12 h-12 text-primary" />
                </div>

                {/* Recipe Content */}
                <div className="p-6">
                  <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">{recipe.name}</h3>
                  
                  {/* Recipe Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Clock" className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{recipe.prepTime + recipe.cookTime} min</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Flame" className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{recipe.calories} cal</span>
                    </div>
                  </div>

                  {/* Nutritional Info */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{recipe.protein}g</p>
                      <p className="text-xs text-gray-600">Protein</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{recipe.carbs}g</p>
                      <p className="text-xs text-gray-600">Carbs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{recipe.fat}g</p>
                      <p className="text-xs text-gray-600">Fat</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {recipe.prepTime + recipe.cookTime < 30 && (
                      <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">Quick</span>
                    )}
                    {recipe.calories < 300 && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Low Cal</span>
                    )}
                    {recipe.protein > 20 && (
                      <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">High Protein</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto" />
            </motion.div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No recipes found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filters</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchTerm('');
                setSelectedFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear Filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Recipes;