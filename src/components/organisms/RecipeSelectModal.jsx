import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import RecipeSummaryCard from '@/components/molecules/RecipeSummaryCard';
import Button from '@/components/atoms/Button';

const RecipeSelectModal = ({ showModal, selectedMeal, recipes, onRecipeSelect, onClose }) => {
    if (!showModal) return null;

    return (
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
                        <Button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ApperIcon name="X" className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-80">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recipes.map((recipe) => (
                            <RecipeSummaryCard
                                key={recipe.id}
                                recipe={recipe}
                                onClick={() => onRecipeSelect(recipe.id)}
                                className="cursor-pointer bg-surface rounded-lg p-4 hover:shadow-md transition-all duration-200"
                                delay={0} // No specific delay needed inside modal grid
                            >
                                <div className="w-full h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-3 flex items-center justify-center">
                                    <ApperIcon name="ChefHat" className="w-6 h-6 text-primary" />
                                </div>
                                <h4 className="font-medium text-gray-900 mb-1">{recipe.name}</h4>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>{recipe.prepTime + recipe.cookTime} min</span>
                                    <span>{recipe.calories} cal</span>
                                </div>
                            </RecipeSummaryCard>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RecipeSelectModal;