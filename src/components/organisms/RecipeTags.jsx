import React from 'react';
import { motion } from 'framer-motion';

const RecipeTags = ({ recipe }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
            <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
                {(recipe.prepTime + recipe.cookTime) < 30 && (
                    <span className="px-3 py-1 bg-success/10 text-success text-sm rounded-full">Quick</span>
                )}
                {recipe.calories < 300 && (
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Low Calorie</span>
                )}
                {recipe.protein > 20 && (
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full">High Protein</span>
                )}
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">Healthy</span>
                <span className="px-3 py-1 bg-accent/10 text-gray-700 text-sm rounded-full">Nutritious</span>
            </div>
        </motion.div>
    );
};

export default RecipeTags;