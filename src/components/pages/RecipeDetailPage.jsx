import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import recipeService from '@/services/api/recipeService';
import Button from '@/components/atoms/Button';
import RecipeDetailHeaderInfo from '@/components/organisms/RecipeDetailHeaderInfo';
import RecipeIngredientsList from '@/components/organisms/RecipeIngredientsList';
import RecipeInstructionsList from '@/components/organisms/RecipeInstructionsList';
import RecipeStatsCard from '@/components/organisms/RecipeStatsCard';
import RecipeTags from '@/components/organisms/RecipeTags';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [servings, setServings] = useState(4); // Default to 4 servings as in original

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
          <Button
            onClick={() => navigate('/recipes')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Recipes
          </Button>
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
        <Button
          onClick={() => navigate('/recipes')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="ArrowLeft" className="w-5 h-5" />
          <span>Back to Recipes</span>
        </Button>

        <RecipeDetailHeaderInfo 
            recipe={recipe} 
            servings={servings} 
            setServings={setServings} 
            adjustNutrition={adjustNutrition} 
        />

        {/* Recipe Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients & Instructions */}
          <div className="lg:col-span-2 space-y-6">
            <RecipeIngredientsList 
                ingredients={recipe.ingredients} 
                servings={servings} 
                adjustQuantity={adjustQuantity} 
            />
            <RecipeInstructionsList instructions={recipe.instructions} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RecipeStatsCard recipe={recipe} />
            <RecipeTags recipe={recipe} />

            {/* Action Button */}
            <Button
              onClick={() => navigate('/meal-planner')}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add to Meal Plan
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeDetailPage;