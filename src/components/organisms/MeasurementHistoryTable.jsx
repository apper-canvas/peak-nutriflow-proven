import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

const MeasurementHistoryTable = ({ metrics }) => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-heading font-semibold text-gray-900 mb-6">Measurement History</h3>
            {metrics.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 text-gray-600 font-medium">Date</th>
                                <th className="text-left py-3 text-gray-600 font-medium">Weight</th>
                                <th className="text-left py-3 text-gray-600 font-medium">Waist</th>
                                <th className="text-left py-3 text-gray-600 font-medium">Hips</th>
                                <th className="text-left py-3 text-gray-600 font-medium">Arms</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.map((metric) => (
                                <tr key={metric.id} className="border-b border-gray-100 last:border-b-0">
                                    <td className="py-3 text-gray-900">{format(new Date(metric.date), 'MMM dd, yyyy')}</td>
                                    <td className="py-3 text-gray-900">{metric.weight} kg</td>
                                    <td className="py-3 text-gray-900">{metric.measurements.waist || '--'} cm</td>
                                    <td className="py-3 text-gray-900">{metric.measurements.hips || '--'} cm</td>
                                    <td className="py-3 text-gray-900">{metric.measurements.arms || '--'} cm</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-8">
                    <ApperIcon name="Ruler" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No measurements recorded yet</p>
                </div>
            )}
        </div>
    );
};

export default MeasurementHistoryTable;