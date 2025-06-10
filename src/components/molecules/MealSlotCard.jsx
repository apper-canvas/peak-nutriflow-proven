import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const MealSlotCard = ({ meal, recipe, mealTypeIcon, onClick }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className="p-3 cursor-pointer hover:bg-surface transition-colors border-r border-gray-100 last:border-r-0"
        >
            {recipe ? (
                <div className="space-y-1">
                    <p className="font-medium text-sm text-gray-900 truncate">{recipe.name}</p>
                    <p className="text-xs text-gray-600">{meal.calories} cal</p>
                    <p className="text-xs text-gray-500">{recipe.prepTime + recipe.cookTime} min</p>
                </div>
            ) : (
                <div className="flex items-center justify-center h-16 text-gray-400">
                    <ApperIcon name="Plus" className="w-5 h-5" />
                </div>
            )}
        </motion.div>
    );
};

export default MealSlotCard;