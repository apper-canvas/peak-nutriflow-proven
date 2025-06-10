import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardOverview from '@/components/organisms/DashboardOverview';
import mealPlanService from '@/services/api/mealPlanService';
import healthMetricService from '@/services/api/healthMetricService';
import recipeService from '@/services/api/recipeService';

const HomePage = () => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-full overflow-hidden"
    >
      <DashboardOverview 
        navigate={navigate}
        currentMealPlan={currentMealPlan}
        todaysMeals={todaysMeals}
        latestMetrics={latestMetrics}
        quickRecipes={quickRecipes}
        loading={loading}
      />
    </motion.div>
  );
};

export default HomePage;