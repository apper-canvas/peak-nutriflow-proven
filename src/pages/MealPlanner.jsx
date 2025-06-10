import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import mealPlanService from '../services/api/mealPlanService';
import recipeService from '../services/api/recipeService';
import { startOfWeek, format, addDays } from 'date-fns';

const MealPlanner = () => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [mealPlan, setMealPlan] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = [
    { type: 'Breakfast', time: '8:00 AM', icon: 'Coffee' },
    { type: 'Lunch', time: '12:30 PM', icon: 'Sun' },
    { type: 'Dinner', time: '7:00 PM', icon: 'Moon' },
    { type: 'Snack', time: '3:00 PM', icon: 'Apple' }
  ];

  useEffect(() => {
    loadMealPlan();
    loadRecipes();
  }, [currentWeek]);

  const loadMealPlan = async () => {
    setLoading(true);
    try {
      const plans = await mealPlanService.getAll();
      const weekPlan = plans.find(plan => 
        new Date(plan.weekStartDate).getTime() === currentWeek.getTime()
      );
      setMealPlan(weekPlan || null);
    } catch (error) {
      toast.error('Failed to load meal plan');
    } finally {
      setLoading(false);
    }
  };

  const loadRecipes = async () => {
    try {
      const allRecipes = await recipeService.getAll();
      setRecipes(allRecipes);
    } catch (error) {
      console.error('Failed to load recipes:', error);
    }
  };

  const getMealForSlot = (day, mealType) => {
    if (!mealPlan) return null;
    return mealPlan.meals.find(meal => meal.day === day && meal.type === mealType);
  };

  const getRecipeForMeal = (meal) => {
    if (!meal) return null;
    return recipes.find(recipe => recipe.id === meal.recipeId);
  };

  const handleMealClick = (day, mealType) => {
    setSelectedMeal({ day, mealType });
    setShowRecipeModal(true);
  };

  const assignRecipeToMeal = async (recipeId) => {
    if (!selectedMeal) return;

    try {
      let updatedPlan;
      
      if (!mealPlan) {
        // Create new meal plan
        const recipe = recipes.find(r => r.id === recipeId);
        const newMeal = {
          id: Date.now().toString(),
          day: selectedMeal.day,
          type: selectedMeal.mealType,
          recipeId: recipeId,
          time: mealTypes.find(m => m.type === selectedMeal.mealType)?.time || '12:00 PM',
          calories: recipe?.calories || 0
        };

        updatedPlan = {
          id: Date.now().toString(),
          weekStartDate: currentWeek.toISOString(),
          meals: [newMeal],
          totalCalories: recipe?.calories || 0,
          userId: 'user1'
        };

        updatedPlan = await mealPlanService.create(updatedPlan);
      } else {
        // Update existing meal plan
        const recipe = recipes.find(r => r.id === recipeId);
        const existingMealIndex = mealPlan.meals.findIndex(
          m => m.day === selectedMeal.day && m.type === selectedMeal.mealType
        );

        let updatedMeals = [...mealPlan.meals];
        
        if (existingMealIndex >= 0) {
          // Update existing meal
          updatedMeals[existingMealIndex] = {
            ...updatedMeals[existingMealIndex],
            recipeId: recipeId,
            calories: recipe?.calories || 0
          };
        } else {
          // Add new meal
          const newMeal = {
            id: Date.now().toString(),
            day: selectedMeal.day,
            type: selectedMeal.mealType,
            recipeId: recipeId,
            time: mealTypes.find(m => m.type === selectedMeal.mealType)?.time || '12:00 PM',
            calories: recipe?.calories || 0
          };
          updatedMeals.push(newMeal);
        }

        const totalCalories = updatedMeals.reduce((sum, meal) => sum + meal.calories, 0);
        
        updatedPlan = await mealPlanService.update(mealPlan.id, {
          ...mealPlan,
          meals: updatedMeals,
          totalCalories
        });
      }

      setMealPlan(updatedPlan);
      setShowRecipeModal(false);
      setSelectedMeal(null);
      toast.success('Meal assigned successfully!');
    } catch (error) {
      toast.error('Failed to assign meal');
    }
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-full overflow-hidden">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-8 gap-4">
              {[...Array(32)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Meal Planner</h1>
            <p className="text-gray-600">Plan your healthy meals for the week</p>
          </div>
          
          {/* Week Navigation */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ApperIcon name="ChevronLeft" className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <p className="font-medium text-gray-900">
                {format(currentWeek, 'MMM d')} - {format(addDays(currentWeek, 6), 'MMM d, yyyy')}
              </p>
            </div>
            
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ApperIcon name="ChevronRight" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Meal Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header Row */}
              <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-200">
                <div className="p-4 font-medium text-gray-900">Meal</div>
                {daysOfWeek.map((day) => (
                  <div key={day} className="p-4 font-medium text-gray-900 text-center">
                    {day}
                  </div>
                ))}
              </div>

              {/* Meal Rows */}
              {mealTypes.map((mealType) => (
                <div key={mealType.type} className="grid grid-cols-8 border-b border-gray-100 last:border-b-0">
                  <div className="p-4 bg-gray-50 border-r border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <ApperIcon name={mealType.icon} className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{mealType.type}</p>
                        <p className="text-xs text-gray-600">{mealType.time}</p>
                      </div>
                    </div>
                  </div>
                  
                  {daysOfWeek.map((day) => {
                    const meal = getMealForSlot(day, mealType.type);
                    const recipe = getRecipeForMeal(meal);
                    
                    return (
                      <motion.div
                        key={`${day}-${mealType.type}`}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleMealClick(day, mealType.type)}
                        className="p-3 cursor-pointer hover:bg-surface transition-colors border-r border-gray-100 last:border-r-0"
                      >
                        {recipe ? (
                          <div className="space-y-1">
                            <p className="font-medium text-sm text-gray-900 truncate">{recipe.name}</p>
                            <p className="text-xs text-gray-600">{recipe.calories} cal</p>
                            <p className="text-xs text-gray-500">{recipe.prepTime + recipe.cookTime} min</p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-16 text-gray-400">
                            <ApperIcon name="Plus" className="w-5 h-5" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Summary */}
        {mealPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">Weekly Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{mealPlan.meals.length}</p>
                <p className="text-sm text-gray-600">Planned Meals</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">{Math.round(mealPlan.totalCalories / 7)}</p>
                <p className="text-sm text-gray-600">Avg Daily Calories</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{Math.round((mealPlan.meals.length / 28) * 100)}%</p>
                <p className="text-sm text-gray-600">Week Complete</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Recipe Selection Modal */}
      {showRecipeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-heading font-semibold text-gray-900">
                  Select Recipe for {selectedMeal?.mealType} - {selectedMeal?.day}
                </h3>
                <button
                  onClick={() => setShowRecipeModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-80">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipes.map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => assignRecipeToMeal(recipe.id)}
                    className="cursor-pointer bg-surface rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-full h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-3 flex items-center justify-center">
                      <ApperIcon name="ChefHat" className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{recipe.name}</h4>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{recipe.prepTime + recipe.cookTime} min</span>
                      <span>{recipe.calories} cal</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default MealPlanner;