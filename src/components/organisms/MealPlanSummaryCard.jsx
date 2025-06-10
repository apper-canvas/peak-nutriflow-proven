import React from 'react';
import { motion } from 'framer-motion';

const MealPlanSummaryCard = ({ mealPlan }) => {
    if (!mealPlan) return null;

    return (
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
    );
};

export default MealPlanSummaryCard;