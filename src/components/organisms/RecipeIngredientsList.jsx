import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const RecipeIngredientsList = ({ ingredients, servings, adjustQuantity }) => {
    const [checkedIngredients, setCheckedIngredients] = useState({});

    const toggleIngredient = (index) => {
        setCheckedIngredients(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
            <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">Ingredients</h2>
            <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className="flex items-center space-x-3"
                    >
                        <button
                            onClick={() => toggleIngredient(index)}
                            className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                                checkedIngredients[index]
                                    ? 'bg-primary border-primary'
                                    : 'border-gray-300 hover:border-primary'
                            }`}
                        >
                            {checkedIngredients[index] && (
                                <ApperIcon name="Check" className="w-3 h-3 text-white" />
                            )}
                        </button>
                        <span className={`flex-1 ${checkedIngredients[index] ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            <span className="font-medium">
                                {adjustQuantity(ingredient.quantity, 4, servings)} {ingredient.unit}
                            </span>
                            {' '}
                            {ingredient.name}
                        </span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default RecipeIngredientsList;