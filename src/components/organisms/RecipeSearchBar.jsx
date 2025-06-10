import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const RecipeSearchBar = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
                type="text"
                placeholder="Search recipes or ingredients..."
                value={searchTerm}
                onChange={onSearchChange}
                className="pl-10 pr-4 py-3"
            />
        </div>
    );
};

export default RecipeSearchBar;