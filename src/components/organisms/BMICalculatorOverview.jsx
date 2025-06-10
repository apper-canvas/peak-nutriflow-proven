import React from 'react';

const BMICalculatorOverview = ({ latestMetric, getBMICategory }) => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-heading font-semibold text-gray-900 mb-6">BMI Calculator</h3>
            
            {latestMetric && (
                <div className="mb-6 p-4 bg-surface rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Current BMI</span>
                        <span className="text-2xl font-bold text-primary">{latestMetric.bmi.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Category</span>
                        <span className={`font-medium ${getBMICategory(latestMetric.bmi).color}`}>
                            {getBMICategory(latestMetric.bmi).category}
                        </span>
                    </div>
                </div>
            )}

            {/* BMI Ranges */}
            <div className="space-y-3">
                <h4 className="font-medium text-gray-900">BMI Categories</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-info">Underweight</span>
                        <span className="text-gray-600">Less than 18.5</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-success">Healthy</span>
                        <span className="text-gray-600">18.5 - 24.9</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-warning">Overweight</span>
                        <span className="text-gray-600">25.0 - 29.9</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-error">Obese</span>
                        <span className="text-gray-600">30.0 and above</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BMICalculatorOverview;