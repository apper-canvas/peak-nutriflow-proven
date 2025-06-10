import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import ApperIcon from '../components/ApperIcon';
import healthMetricService from '../services/api/healthMetricService';
import { format } from 'date-fns';

const HealthTracking = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('weight');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    waist: '',
    hips: '',
    arms: ''
  });

  const tabs = [
    { id: 'weight', label: 'Weight Tracking', icon: 'Scale' },
    { id: 'bmi', label: 'BMI Calculator', icon: 'Calculator' },
    { id: 'measurements', label: 'Body Measurements', icon: 'Ruler' }
  ];

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await healthMetricService.getAll();
      setMetrics(data);
    } catch (error) {
      toast.error('Failed to load health metrics');
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-info' };
    if (bmi < 25) return { category: 'Healthy', color: 'text-success' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-warning' };
    return { category: 'Obese', color: 'text-error' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.weight) {
      toast.error('Weight is required');
      return;
    }

    try {
      const weight = parseFloat(formData.weight);
      const height = formData.height ? parseFloat(formData.height) : 170; // Default height
      const bmi = calculateBMI(weight, height);

      const newMetric = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        weight: weight,
        measurements: {
          waist: formData.waist ? parseFloat(formData.waist) : null,
          hips: formData.hips ? parseFloat(formData.hips) : null,
          arms: formData.arms ? parseFloat(formData.arms) : null
        },
        bmi: bmi,
        userId: 'user1'
      };

      const created = await healthMetricService.create(newMetric);
      setMetrics(prev => [created, ...prev]);
      setFormData({ weight: '', height: '', waist: '', hips: '', arms: '' });
      setShowAddForm(false);
      toast.success('Health metric added successfully!');
    } catch (error) {
      toast.error('Failed to add health metric');
    }
  };

  const getWeightChartData = () => {
    if (metrics.length === 0) return { categories: [], series: [] };

    const sortedMetrics = [...metrics].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      categories: sortedMetrics.map(metric => format(new Date(metric.date), 'MMM dd')),
      series: [{
        name: 'Weight (kg)',
        data: sortedMetrics.map(metric => metric.weight)
      }]
    };
  };

  const getBMIChartData = () => {
    if (metrics.length === 0) return { categories: [], series: [] };

    const sortedMetrics = [...metrics].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      categories: sortedMetrics.map(metric => format(new Date(metric.date), 'MMM dd')),
      series: [{
        name: 'BMI',
        data: sortedMetrics.map(metric => metric.bmi)
      }]
    };
  };

  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['#FF6B6B'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 4
    },
    xaxis: {
      labels: {
        style: {
          colors: '#666',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#666',
          fontSize: '12px'
        }
      }
    },
    markers: {
      size: 6,
      colors: ['#FF6B6B'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 8
      }
    },
    tooltip: {
      theme: 'light'
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-full overflow-hidden">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="flex space-x-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded flex-1"></div>
            ))}
          </div>
          <div className="h-80 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-full overflow-hidden"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Health Tracking</h1>
            <p className="text-gray-600">Monitor your progress towards your health goals</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="mt-4 md:mt-0 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span>Add Measurement</span>
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Weight Tracking Tab */}
        {activeTab === 'weight' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Weight Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Scale" className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-gray-900">Current Weight</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {metrics.length > 0 ? `${metrics[0].weight} kg` : '--'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {metrics.length > 0 ? `Last updated ${format(new Date(metrics[0].date), 'MMM dd, yyyy')}` : 'No data yet'}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="TrendingUp" className="w-5 h-5 text-secondary" />
                  </div>
                  <h3 className="font-heading font-semibold text-gray-900">Weight Goal</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">70 kg</p>
                <p className="text-sm text-gray-600 mt-1">Target weight</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Target" className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-heading font-semibold text-gray-900">Progress</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {metrics.length >= 2 ? 
                    `${(metrics[1].weight - metrics[0].weight).toFixed(1)} kg` : 
                    '--'
                  }
                </p>
                <p className="text-sm text-success mt-1">This week</p>
              </div>
            </div>

            {/* Weight Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-heading font-semibold text-gray-900 mb-6">Weight Progress</h3>
              {metrics.length > 0 ? (
                <Chart
                  options={chartOptions}
                  series={getWeightChartData().series}
                  type="line"
                  height={350}
                />
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <ApperIcon name="TrendingUp" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No weight data yet. Add your first measurement to see your progress!</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* BMI Calculator Tab */}
        {activeTab === 'bmi' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* BMI Calculator */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-heading font-semibold text-gray-900 mb-6">BMI Calculator</h3>
                
                {metrics.length > 0 && (
                  <div className="mb-6 p-4 bg-surface rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Current BMI</span>
                      <span className="text-2xl font-bold text-primary">{metrics[0].bmi.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Category</span>
                      <span className={`font-medium ${getBMICategory(metrics[0].bmi).color}`}>
                        {getBMICategory(metrics[0].bmi).category}
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

              {/* BMI Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-heading font-semibold text-gray-900 mb-6">BMI Trend</h3>
                {metrics.length > 0 ? (
                  <Chart
                    options={{
                      ...chartOptions,
                      colors: ['#4ECDC4'],
                      markers: {
                        ...chartOptions.markers,
                        colors: ['#4ECDC4']
                      }
                    }}
                    series={getBMIChartData().series}
                    type="line"
                    height={300}
                  />
                ) : (
                  <div className="h-72 flex items-center justify-center">
                    <div className="text-center">
                      <ApperIcon name="Calculator" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Add measurements to see your BMI trend</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Body Measurements Tab */}
        {activeTab === 'measurements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-3">
                  <ApperIcon name="Circle" className="w-5 h-5 text-primary" />
                  <h3 className="font-heading font-semibold text-gray-900">Waist</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.length > 0 && metrics[0].measurements.waist ? 
                    `${metrics[0].measurements.waist} cm` : '--'
                  }
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-3">
                  <ApperIcon name="Circle" className="w-5 h-5 text-secondary" />
                  <h3 className="font-heading font-semibold text-gray-900">Hips</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.length > 0 && metrics[0].measurements.hips ? 
                    `${metrics[0].measurements.hips} cm` : '--'
                  }
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-3">
                  <ApperIcon name="Circle" className="w-5 h-5 text-accent" />
                  <h3 className="font-heading font-semibold text-gray-900">Arms</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.length > 0 && metrics[0].measurements.arms ? 
                    `${metrics[0].measurements.arms} cm` : '--'
                  }
                </p>
              </div>
            </div>

            {/* Measurements History */}
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
                      {metrics.map((metric, index) => (
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
          </motion.div>
        )}
      </div>

      {/* Add Measurement Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-gray-900">Add Health Measurement</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="70.5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="170"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Waist (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.waist}
                    onChange={(e) => setFormData(prev => ({ ...prev, waist: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hips (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.hips}
                    onChange={(e) => setFormData(prev => ({ ...prev, hips: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="90"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Arms (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.arms}
                    onChange={(e) => setFormData(prev => ({ ...prev, arms: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add Measurement
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default HealthTracking;