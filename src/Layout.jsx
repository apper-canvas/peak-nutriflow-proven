import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { navigationRoutes } from './config/routes';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 z-40">
        <div className="h-full px-4 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Heart" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-heading font-bold text-gray-900">NutriFlow</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationRoutes.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 hover:text-primary hover:bg-surface'
                  }`
                }
              >
                <ApperIcon name={route.icon} className="w-4 h-4" />
                <span>{route.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-surface"
          >
            <ApperIcon name={mobileMenuOpen ? 'X' : 'Menu'} className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 z-50"
          >
            <nav className="px-4 py-2 space-y-1">
              {navigationRoutes.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-surface'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} className="w-5 h-5" />
                  <span>{route.label}</span>
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden border-t border-gray-200 bg-white z-40">
        <nav className="flex items-center justify-around py-2">
          {navigationRoutes.slice(0, 4).map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 text-xs transition-all duration-200 ${
                  isActive ? 'text-primary' : 'text-gray-500'
                }`
              }
            >
              <ApperIcon name={route.icon} className="w-5 h-5 mb-1" />
              <span className="font-medium">{route.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;