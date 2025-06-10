import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import healthMetricService from '@/services/api/healthMetricService';
import AddMeasurementForm from '@/components/organisms/AddMeasurementForm';
import HealthSummaryCards from '@/components/organisms/HealthSummaryCards';
import MetricTrendChart from '@/components/organisms/MetricTrendChart';
import BMICalculatorOverview from '@/components/organisms/BMICalculatorOverview';
import MeasurementHistoryTable from '@/components/organisms/MeasurementHistoryTable';
import Button from '@/components/atoms/Button';
import TabButton from '@/components/molecules/TabButton';

const HealthTrackingPage = () => {
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

  const tabs = useMemo(() => [
    { id: 'weight', label: 'Weight Tracking', icon: 'Scale' },
    { id: 'bmi', label: 'BMI Calculator', icon: 'Calculator' },
    { id: 'measurements', label: 'Body Measurements', icon: 'Ruler' }
  ], []);

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

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.weight) {
      toast.error('Weight is required');
      return;
    }

    try {
      const weight = parseFloat(formData.weight);
      // Default height to 170 if not provided, for BMI calculation
      const height = formData.height ? parseFloat(formData.height) : 170; 
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

  const getWeightChartData = useMemo(() => {
    if (metrics.length === 0) return { categories: [], series: [] };

    const sortedMetrics = [...metrics].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      categories: sortedMetrics.map(metric => format(new Date(metric.date), 'MMM dd')),
      series: [{
        name: 'Weight (kg)',
        data: sortedMetrics.map(metric => metric.weight)
      }]
    };
  }, [metrics]);

  const getBMIChartData = useMemo(() => {
    if (metrics.length === 0) return { categories: [], series: [] };

    const sortedMetrics = [...metrics].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      categories: sortedMetrics.map(metric => format(new Date(metric.date), 'MMM dd')),
      series: [{
        name: 'BMI',
        data: sortedMetrics.map(metric => metric.bmi)
      }]
    };
  }, [metrics]);

  const commonChartOptions = useMemo(() => ({
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
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
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 8
      }
    },
    tooltip: {
      theme: 'light'
    }
  }), []);

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
          
          <Button
            onClick={() => setShowAddForm(true)}
            className="mt-4 md:mt-0 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span>Add Measurement</span>
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              iconName={tab.icon}
              label={tab.label}
              onClick={() => setActiveTab(tab.id)}
              isActive={activeTab === tab.id}
            />
          ))}
        </div>

        {/* Weight Tracking Tab */}
        {activeTab === 'weight' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <HealthSummaryCards metrics={metrics} />
            <MetricTrendChart
                title="Weight Progress"
                chartData={getWeightChartData}
                chartOptions={{ ...commonChartOptions, colors: ['#FF6B6B'], markers: { ...commonChartOptions.markers, colors: ['#FF6B6B'] } }}
                noDataMessage="No weight data yet. Add your first measurement to see your progress!"
                noDataIconName="TrendingUp"
            />
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
              <BMICalculatorOverview 
                latestMetric={metrics.length > 0 ? metrics[0] : null} 
                getBMICategory={getBMICategory} 
              />
              <MetricTrendChart
                title="BMI Trend"
                chartData={getBMIChartData}
                chartOptions={{ ...commonChartOptions, colors: ['#4ECDC4'], markers: { ...commonChartOptions.markers, colors: ['#4ECDC4'] }, chart: { ...commonChartOptions.chart, height: 300 } }}
                noDataMessage="Add measurements to see your BMI trend"
                noDataIconName="Calculator"
              />
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
            <MeasurementHistoryTable metrics={metrics} />
          </motion.div>
        )}
      </div>

      <AddMeasurementForm
        showAddForm={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleSubmit}
        formData={formData}
        onFormChange={handleFormChange}
      />
    </motion.div>
  );
};

export default HealthTrackingPage;