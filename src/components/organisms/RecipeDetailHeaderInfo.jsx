import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const RecipeDetailHeaderInfo = ({ recipe, servings, setServings, adjustNutrition }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Hero Image */}
            <div className="h-64 md:h-80 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <ApperIcon name="ChefHat" className="w-20 h-20 text-primary" />
            </div>

            {/* Recipe Info */}
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">{recipe.name}</h1>
                        <div className="flex items-center space-x-6 text-gray-600">
                            <div className="flex items-center space-x-2">
                                <ApperIcon name="Clock" className="w-5 h-5" />
                                <span>Prep: {recipe.prepTime} min</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <ApperIcon name="Timer" className="w-5 h-5" />
                                <span>Cook: {recipe.cookTime} min</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <ApperIcon name="Users" className="w-5 h-5" />
                                <span>{servings} servings</span>
                            </div>
                        </div>
                    </div>

                    {/* Servings Adjuster */}
                    <div className="mt-4 md:mt-0">
                        <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-700">Servings:</span>
                            <div className="flex items-center space-x-2">
                                <Button
                                    onClick={() => setServings(Math.max(1, servings - 1))}
                                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <ApperIcon name="Minus" className="w-4 h-4" />
                                </Button>
                                <span className="w-8 text-center font-medium">{servings}</span>
                                <Button
                                    onClick={() => setServings(servings + 1)}
                                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <ApperIcon name="Plus" className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nutritional Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-surface rounded-lg">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{adjustNutrition(recipe.calories, 4, servings)}</p>
                        <p className="text-sm text-gray-600">Calories</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-secondary">{adjustNutrition(recipe.protein, 4, servings)}g</p>
                        <p className="text-sm text-gray-600">Protein</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-accent">{adjustNutrition(recipe.carbs, 4, servings)}g</p>
                        <p className="text-sm text-gray-600">Carbs</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-warning">{adjustNutrition(recipe.fat, 4, servings)}g</p>
                        <p className="text-sm text-gray-600">Fat</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetailHeaderInfo;