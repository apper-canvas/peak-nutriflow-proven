import React from 'react';
import { motion } from 'framer-motion';
import RecipeSummaryCard from '@/components/molecules/RecipeSummaryCard';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const RecipeGridList = ({ recipes, onRecipeClick, onClearFilters }) => {
    if (recipes.length === 0) {
        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
            >
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                >
                    <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto" />
                </motion.div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No recipes found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your search or filters</p>
                <Button
                    onClick={onClearFilters}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Clear Filters
                </Button>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
                <RecipeSummaryCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => onRecipeClick(recipe.id)}
                    delay={index * 0.1}
                />
            ))}
        </div>
    );
};

export default RecipeGridList;