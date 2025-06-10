import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import recipeService from '@/services/api/recipeService';
import RecipeSearchBar from '@/components/organisms/RecipeSearchBar';
import RecipeFilterButtons from '@/components/organisms/RecipeFilterButtons';
import RecipeGridList from '@/components/organisms/RecipeGridList';

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const navigate = useNavigate();

  const filters = useMemo(() => [
    { id: 'all', label: 'All Recipes', icon: 'ChefHat' },
    { id: 'quick', label: 'Quick (< 30 min)', icon: 'Clock' },
    { id: 'lowcal', label: 'Low Calorie (< 300)', icon: 'Heart' },
    { id: 'protein', label: 'High Protein', icon: 'Zap' }
  ], []);

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
        filtered = filtered.filter(recipe => (recipe.prepTime + recipe.cookTime) < 30);
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterId) => {
    setSelectedFilter(filterId);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedFilter('all');
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
          <RecipeSearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
          <RecipeFilterButtons 
            filters={filters} 
            selectedFilter={selectedFilter} 
            onFilterChange={handleFilterChange} 
          />
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <RecipeGridList 
            recipes={filteredRecipes} 
            onRecipeClick={(id) => navigate(`/recipe/${id}`)}
            onClearFilters={handleClearFilters}
        />
      </div>
    </motion.div>
  );
};

export default RecipesPage;