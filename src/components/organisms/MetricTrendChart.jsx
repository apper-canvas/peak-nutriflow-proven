import React from 'react';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';

const MetricTrendChart = ({ title, chartData, chartOptions, noDataMessage, noDataIconName }) => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-heading font-semibold text-gray-900 mb-6">{title}</h3>
            {chartData.series.length > 0 && chartData.series[0].data.length > 0 ? (
                <Chart
                    options={{
                        ...chartOptions,
                        xaxis: {
                            ...chartOptions.xaxis,
                            categories: chartData.categories
                        }
                    }}
                    series={chartData.series}
                    type="line"
                    height={chartOptions.chart.height}
                />
            ) : (
                <div className={`h-${chartOptions.chart.height / 4} flex items-center justify-center`}>
                    <div className="text-center">
                        <ApperIcon name={noDataIconName} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">{noDataMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MetricTrendChart;