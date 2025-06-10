import React from 'react';
import { motion } from 'framer-motion';

const RecipeInstructionsList = ({ instructions }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
            <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">Instructions</h2>
            <div className="space-y-4">
                {instructions.map((instruction, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex space-x-4"
                    >
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed pt-1">{instruction}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default RecipeInstructionsList;