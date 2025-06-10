import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import recipeService from '../services/api/recipeService';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [servings, setServings] = useState(4);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await recipeService.getById(id);
      if (!data) {
        setError('Recipe not found');
        return;
      }
      setRecipe(data);
    } catch (err) {
      setError(err.message || 'Failed to load recipe');
      toast.error('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const toggleIngredient = (index) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const adjustQuantity = (originalQuantity, originalServings, newServings) => {
    const ratio = newServings / originalServings;
    const adjusted = (originalQuantity * ratio);
    return adjusted % 1 === 0 ? adjusted.toString() : adjusted.toFixed(1);
  };

  const adjustNutrition = (value, originalServings, newServings) => {
    const ratio = newServings / originalServings;
    return Math.round(value * ratio);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-full overflow-hidden">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-full overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Recipe Not Found</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => navigate('/recipes')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Recipes
          </button>
        </motion.div>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-full overflow-hidden"
    >
      <div className="space-y-6">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/recipes')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ApperIcon name="ArrowLeft" className="w-5 h-5" />
          <span>Back to Recipes</span>
        </motion.button>

        {/* Recipe Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Hero Image */}
          <div className="h-64 md:h-80 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <ApperIcon name="ChefHat" className="w-20 h-20 text-primary" />
          </div>

          {/* Recipe Info */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">{recipe.name}</h1>
                <div className="flex items-center space-x-6 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Clock" className="w-5 h-5" />
                    <span>Prep: {recipe.prepTime} min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Timer" className="w-5 h-5" />
                    <span>Cook: {recipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Users" className="w-5 h-5" />
                    <span>{servings} servings</span>
                  </div>
                </div>
              </div>

              {/* Servings Adjuster */}
              <div className="mt-4 md:mt-0">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">Servings:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <ApperIcon name="Minus" className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{servings}</span>
                    <button
                      onClick={() => setServings(servings + 1)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <ApperIcon name="Plus" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Nutritional Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-surface rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{adjustNutrition(recipe.calories, 4, servings)}</p>
                <p className="text-sm text-gray-600">Calories</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">{adjustNutrition(recipe.protein, 4, servings)}g</p>
                <p className="text-sm text-gray-600">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{adjustNutrition(recipe.carbs, 4, servings)}g</p>
                <p className="text-sm text-gray-600">Carbs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">{adjustNutrition(recipe.fat, 4, servings)}g</p>
                <p className="text-sm text-gray-600">Fat</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients & Instructions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ingredients */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">Ingredients</h2>
              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="flex items-center space-x-3"
                  >
                    <button
                      onClick={() => toggleIngredient(index)}
                      className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                        checkedIngredients[index]
                          ? 'bg-primary border-primary'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {checkedIngredients[index] && (
                        <ApperIcon name="Check" className="w-3 h-3 text-white" />
                      )}
                    </button>
                    <span className={`flex-1 ${checkedIngredients[index] ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      <span className="font-medium">
                        {adjustQuantity(ingredient.quantity, 4, servings)} {ingredient.unit}
                      </span>
                      {' '}
                      {ingredient.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">Instructions</h2>
              <div className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex space-x-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed pt-1">{instruction}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">Recipe Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Time</span>
                  <span className="font-medium">{recipe.prepTime + recipe.cookTime} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Difficulty</span>
                  <span className="font-medium">Easy</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Meal Type</span>
                  <span className="font-medium">Main Course</span>
                </div>
              </div>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.prepTime + recipe.cookTime < 30 && (
                  <span className="px-3 py-1 bg-success/10 text-success text-sm rounded-full">Quick</span>
                )}
                {recipe.calories < 300 && (
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Low Calorie</span>
                )}
                {recipe.protein > 20 && (
                  <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full">High Protein</span>
                )}
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">Healthy</span>
                <span className="px-3 py-1 bg-accent/10 text-gray-700 text-sm rounded-full">Nutritious</span>
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/meal-planner')}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Add to Meal Plan
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeDetail;