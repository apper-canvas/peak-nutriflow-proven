import React from 'react';
import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-full overflow-hidden"
    >
      <MainFeature />
    </motion.div>
  );
};

export default Home;