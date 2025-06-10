import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { startOfWeek, format, addDays } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import mealPlanService from '@/services/api/mealPlanService';
import recipeService from '@/services/api/recipeService';
import Button from '@/components/atoms/Button';
import MealPlannerCalendar from '@/components/organisms/MealPlannerCalendar';
import MealPlanSummaryCard from '@/components/organisms/MealPlanSummaryCard';
import RecipeSelectModal from '@/components/organisms/RecipeSelectModal';

const MealPlannerPage = () => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [mealPlan, setMealPlan] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  const daysOfWeek = useMemo(() => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], []);
  const mealTypes = useMemo(() => [
    { type: 'Breakfast', time: '8:00 AM', icon: 'Coffee' },
    { type: 'Lunch', time: '12:30 PM', icon: 'Sun' },
    { type: 'Dinner', time: '7:00 PM', icon: 'Moon' },
    { type: 'Snack', time: '3:00 PM', icon: 'Apple' }
  ], []);

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

  const handleMealClick = (day, mealType) => {
    setSelectedMeal({ day, mealType });
    setShowRecipeModal(true);
  };

  const assignRecipeToMeal = async (recipeId) => {
    if (!selectedMeal) return;

    try {
      let updatedPlan;
      const recipe = recipes.find(r => r.id === recipeId);
      
      if (!mealPlan) {
        // Create new meal plan
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
            <Button
              onClick={() => navigateWeek('prev')}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="ChevronLeft" className="w-5 h-5" />
            </Button>
            
            <div className="text-center">
              <p className="font-medium text-gray-900">
                {format(currentWeek, 'MMM d')} - {format(addDays(currentWeek, 6), 'MMM d, yyyy')}
              </p>
            </div>
            
            <Button
              onClick={() => navigateWeek('next')}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="ChevronRight" className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <MealPlannerCalendar
            mealPlan={mealPlan}
            recipes={recipes}
            daysOfWeek={daysOfWeek}
            mealTypes={mealTypes}
            onMealSlotClick={handleMealClick}
        />

        <MealPlanSummaryCard mealPlan={mealPlan} />
      </div>

      <RecipeSelectModal
        showModal={showRecipeModal}
        selectedMeal={selectedMeal}
        recipes={recipes}
        onRecipeSelect={assignRecipeToMeal}
        onClose={() => setShowRecipeModal(false)}
      />
    </motion.div>
  );
};

export default MealPlannerPage;