import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-full overflow-hidden"
    >
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mb-8"
          >
            <ApperIcon name="MapPin" className="w-24 h-24 text-gray-300 mx-auto" />
          </motion.div>
          
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist. Let's get you back on track to your health journey.
          </p>
          
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Go to Dashboard
            </motion.button>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/meal-planner')}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Meal Planner
              </button>
              <span className="text-gray-400">•</span>
              <button
                onClick={() => navigate('/recipes')}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Recipes
              </button>
              <span className="text-gray-400">•</span>
              <button
                onClick={() => navigate('/health-tracking')}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Health Tracking
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;