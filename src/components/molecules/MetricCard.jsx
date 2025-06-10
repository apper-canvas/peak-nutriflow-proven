import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const MetricCard = ({ iconName, iconBgColor, iconTextColor, title, value, description, className = '' }) => {
    return (
        <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
            <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
                    <ApperIcon name={iconName} className={`w-5 h-5 ${iconTextColor}`} />
                </div>
                <h3 className="font-heading font-semibold text-gray-900">{title}</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
                {value}
            </p>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
    );
};

export default MetricCard;