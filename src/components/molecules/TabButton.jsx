import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const TabButton = ({ iconName, label, onClick, isActive }) => {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
            }`}
        >
            <ApperIcon name={iconName} className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
};

export default TabButton;