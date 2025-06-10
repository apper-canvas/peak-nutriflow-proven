import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import MetricCard from '@/components/molecules/MetricCard';
import RecipeSummaryCard from '@/components/molecules/RecipeSummaryCard';
import Button from '@/components/atoms/Button';

const DashboardOverview = ({ navigate, currentMealPlan, todaysMeals, latestMetrics, quickRecipes, loading }) => {
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
                        <Button
                            onClick={() => navigate('/meal-planner')}
                            className="text-primary hover:text-primary/80 text-sm font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            View Full Plan
                        </Button>
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
                            <Button
                                onClick={() => navigate('/meal-planner')}
                                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Plan Your Meals
                            </Button>
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
                    <MetricCard
                        iconName="Scale"
                        iconBgColor="bg-secondary/10"
                        iconTextColor="text-secondary"
                        title="Current Weight"
                        value={latestMetrics ? `${latestMetrics.weight} kg` : '--'}
                        description="Last updated today"
                        className="p-4"
                    />

                    <MetricCard
                        iconName="Activity"
                        iconBgColor="bg-accent/10"
                        iconTextColor="text-accent"
                        title="BMI"
                        value={latestMetrics ? latestMetrics.bmi.toFixed(1) : '--'}
                        description="Healthy range"
                        className="p-4"
                    />
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
                    <Button
                        onClick={() => navigate('/recipes')}
                        className="text-primary hover:text-primary/80 text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Browse All
                    </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickRecipes.map((recipe, index) => (
                        <RecipeSummaryCard
                            key={recipe.id}
                            recipe={recipe}
                            onClick={() => navigate(`/recipe/${recipe.id}`)}
                            delay={0.4 + index * 0.1}
                            className="p-4"
                        />
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
                <Button
                    onClick={() => navigate('/meal-planner')}
                    className="bg-primary text-white p-4 rounded-xl hover:bg-primary/90 transition-colors flex items-center space-x-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ApperIcon name="Calendar" className="w-6 h-6" />
                    <span className="font-medium">Plan This Week</span>
                </Button>
                
                <Button
                    onClick={() => navigate('/health-tracking')}
                    className="bg-secondary text-white p-4 rounded-xl hover:bg-secondary/90 transition-colors flex items-center space-x-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ApperIcon name="TrendingUp" className="w-6 h-6" />
                    <span className="font-medium">Track Progress</span>
                </Button>
                
                <Button
                    onClick={() => navigate('/recipes')}
                    className="bg-accent text-gray-900 p-4 rounded-xl hover:bg-accent/90 transition-colors flex items-center space-x-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ApperIcon name="BookOpen" className="w-6 h-6" />
                    <span className="font-medium">Find Recipes</span>
                </Button>
            </motion.div>
        </div>
    );
};

export default DashboardOverview;