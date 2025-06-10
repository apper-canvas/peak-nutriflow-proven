import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const RecipeSummaryCard = ({ recipe, onClick, delay = 0 }) => {
    const totalTime = recipe.prepTime + recipe.cookTime;
    const isQuick = totalTime < 30;
    const isLowCal = recipe.calories < 300;
    const isHighProtein = recipe.protein > 20;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay }}
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200"
>
            {/* Recipe Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={recipe.image}
                    alt={`Delicious ${recipe.name} - A healthy recipe with ${recipe.calories} calories`}
                    className="recipe-image w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                    }}
                />
                <div className="recipe-image-fallback hidden h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <ApperIcon name="ChefHat" className="w-12 h-12 text-primary" />
                </div>
            </div>

            {/* Recipe Content */}
            <div className="p-6">
                <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">{recipe.name}</h3>
                
                {/* Recipe Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                        <ApperIcon name="Clock" className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{totalTime} min</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ApperIcon name="Flame" className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{recipe.calories} cal</span>
                    </div>
                </div>

                {/* Nutritional Info */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">{recipe.protein}g</p>
                        <p className="text-xs text-gray-600">Protein</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">{recipe.carbs}g</p>
                        <p className="text-xs text-gray-600">Carbs</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">{recipe.fat}g</p>
                        <p className="text-xs text-gray-600">Fat</p>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                    {isQuick && (
                        <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">Quick</span>
                    )}
                    {isLowCal && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Low Cal</span>
                    )}
                    {isHighProtein && (
                        <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">High Protein</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default RecipeSummaryCard;