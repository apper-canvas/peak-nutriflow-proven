import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import MealSlotCard from '@/components/molecules/MealSlotCard';

const MealPlannerCalendar = ({ mealPlan, recipes, daysOfWeek, mealTypes, onMealSlotClick }) => {
    const getMealForSlot = (day, mealType) => {
        if (!mealPlan) return null;
        return mealPlan.meals.find(meal => meal.day === day && meal.type === mealType);
    };

    const getRecipeForMeal = (meal) => {
        if (!meal) return null;
        return recipes.find(recipe => recipe.id === meal.recipeId);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <div className="min-w-full">
                    {/* Header Row */}
                    <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-200">
                        <div className="p-4 font-medium text-gray-900">Meal</div>
                        {daysOfWeek.map((day) => (
                            <div key={day} className="p-4 font-medium text-gray-900 text-center">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Meal Rows */}
                    {mealTypes.map((mealType) => (
                        <div key={mealType.type} className="grid grid-cols-8 border-b border-gray-100 last:border-b-0">
                            <div className="p-4 bg-gray-50 border-r border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <ApperIcon name={mealType.icon} className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{mealType.type}</p>
                                        <p className="text-xs text-gray-600">{mealType.time}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {daysOfWeek.map((day) => {
                                const meal = getMealForSlot(day, mealType.type);
                                const recipe = getRecipeForMeal(meal);
                                
                                return (
                                    <MealSlotCard
                                        key={`${day}-${mealType.type}`}
                                        meal={meal}
                                        recipe={recipe}
                                        mealTypeIcon={mealType.icon}
                                        onClick={() => onMealSlotClick(day, mealType.type)}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MealPlannerCalendar;