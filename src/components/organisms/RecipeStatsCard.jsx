import React from 'react';
import { motion } from 'framer-motion';

const RecipeStatsCard = ({ recipe }) => {
    return (
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
    );
};

export default RecipeStatsCard;