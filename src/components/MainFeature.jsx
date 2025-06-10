import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from './ApperIcon';
import mealPlanService from '../services/api/mealPlanService';
import healthMetricService from '../services/api/healthMetricService';
import recipeService from '../services/api/recipeService';

const MainFeature = () => {
  const [currentMealPlan, setCurrentMealPlan] = useState(null);
  const [todaysMeals, setTodaysMeals] = useState([]);
  const [latestMetrics, setLatestMetrics] = useState(null);
  const [quickRecipes, setQuickRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Load current week's meal plan
        const mealPlans = await mealPlanService.getAll();
        const currentPlan = mealPlans[0]; // Most recent plan
        setCurrentMealPlan(currentPlan);

        // Get today's meals
        if (currentPlan) {
          const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
          const todayMeals = currentPlan.meals.filter(meal => meal.day === today);
          setTodaysMeals(todayMeals);
        }

        // Load latest health metrics
        const metrics = await healthMetricService.getAll();
        setLatestMetrics(metrics[0]); // Most recent

        // Load quick recipes
        const allRecipes = await recipeService.getAll();
        setQuickRecipes(allRecipes.slice(0, 3));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white"
      >
        <h2 className="text-2xl font-heading font-bold mb-2">Good morning! 🌟</h2>
        <p className="text-white/90">Ready to continue your healthy journey today?</p>
      </motion.div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Meals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-gray-900">Today's Meals</h3>
            <button
              onClick={() => navigate('/meal-planner')}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View Full Plan
            </button>
          </div>
          
          {todaysMeals.length > 0 ? (
            <div className="space-y-3">
              {todaysMeals.map((meal, index) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-surface rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ApperIcon 
                        name={meal.type === 'Breakfast' ? 'Coffee' : meal.type === 'Lunch' ? 'Sun' : meal.type === 'Dinner' ? 'Moon' : 'Apple'}
                        className="w-4 h-4 text-primary"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{meal.type}</p>
                      <p className="text-sm text-gray-600">{meal.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{meal.calories} cal</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No meals planned for today</p>
              <button
                onClick={() => navigate('/meal-planner')}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Plan Your Meals
              </button>
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Current Weight */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Scale" className="w-4 h-4 text-secondary" />
              </div>
              <h4 className="font-medium text-gray-900">Current Weight</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {latestMetrics ? `${latestMetrics.weight} kg` : '--'}
            </p>
            <p className="text-sm text-gray-600">Last updated today</p>
          </div>

          {/* BMI */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Activity" className="w-4 h-4 text-accent" />
              </div>
              <h4 className="font-medium text-gray-900">BMI</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {latestMetrics ? latestMetrics.bmi.toFixed(1) : '--'}
            </p>
            <p className="text-sm text-success">Healthy range</p>
          </div>
        </motion.div>
      </div>

      {/* Quick Recipe Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-gray-900">Quick Recipe Ideas</h3>
          <button
            onClick={() => navigate('/recipes')}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Browse All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="cursor-pointer bg-surface rounded-lg p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-3 flex items-center justify-center">
                <ApperIcon name="ChefHat" className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{recipe.name}</h4>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{recipe.prepTime + recipe.cookTime} min</span>
                <span>{recipe.calories} cal</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <button
          onClick={() => navigate('/meal-planner')}
          className="bg-primary text-white p-4 rounded-xl hover:bg-primary/90 transition-colors flex items-center space-x-3"
        >
          <ApperIcon name="Calendar" className="w-6 h-6" />
          <span className="font-medium">Plan This Week</span>
        </button>
        
        <button
          onClick={() => navigate('/health-tracking')}
          className="bg-secondary text-white p-4 rounded-xl hover:bg-secondary/90 transition-colors flex items-center space-x-3"
        >
          <ApperIcon name="TrendingUp" className="w-6 h-6" />
          <span className="font-medium">Track Progress</span>
        </button>
        
        <button
          onClick={() => navigate('/recipes')}
          className="bg-accent text-gray-900 p-4 rounded-xl hover:bg-accent/90 transition-colors flex items-center space-x-3"
        >
          <ApperIcon name="BookOpen" className="w-6 h-6" />
          <span className="font-medium">Find Recipes</span>
        </button>
      </motion.div>
    </div>
  );
};

export default MainFeature;