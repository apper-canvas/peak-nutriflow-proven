import React from 'react';
import TabButton from '@/components/molecules/TabButton';

const RecipeFilterButtons = ({ filters, selectedFilter, onFilterChange }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
                <TabButton
                    key={filter.id}
                    iconName={filter.icon}
                    label={filter.label}
                    onClick={() => onFilterChange(filter.id)}
                    isActive={selectedFilter === filter.id}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedFilter === filter.id
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                />
            ))}
        </div>
    );
};

export default RecipeFilterButtons;