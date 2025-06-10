import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Target, Weight, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import { useAuth } from '@/hooks/useAuth';

const NutritionGoalsPage = () => {
  const navigate = useNavigate();
  const { user, updateNutritionGoals } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentWeight: '',
    goalWeight: '',
    timeframe: '',
    goalType: ''
  });
  const [errors, setErrors] = useState({});
  const [bmi, setBmi] = useState(null);
  const [weeklyWeightChange, setWeeklyWeightChange] = useState(null);

  const timeframeOptions = [
    { value: '4', label: '1 Month' },
    { value: '8', label: '2 Months' },
    { value: '12', label: '3 Months' },
    { value: '24', label: '6 Months' },
    { value: '52', label: '1 Year' }
  ];

  // Calculate BMI and weekly weight change
  useEffect(() => {
    if (formData.currentWeight && user?.profile?.height) {
      const weightKg = parseFloat(formData.currentWeight);
      const heightM = user.profile.height / 100;
      const calculatedBmi = weightKg / (heightM * heightM);
      setBmi(calculatedBmi);
    }

    if (formData.currentWeight && formData.goalWeight && formData.timeframe) {
      const weightDiff = parseFloat(formData.goalWeight) - parseFloat(formData.currentWeight);
      const weeks = parseInt(formData.timeframe);
      const weeklyChange = weightDiff / weeks;
      setWeeklyWeightChange(weeklyChange);
    }
  }, [formData, user]);

  // Determine goal type based on weight difference
  useEffect(() => {
    if (formData.currentWeight && formData.goalWeight) {
      const current = parseFloat(formData.currentWeight);
      const goal = parseFloat(formData.goalWeight);
      
      if (goal > current) {
        setFormData(prev => ({ ...prev, goalType: 'gain' }));
      } else if (goal < current) {
        setFormData(prev => ({ ...prev, goalType: 'lose' }));
      } else {
        setFormData(prev => ({ ...prev, goalType: 'maintain' }));
      }
    }
  }, [formData.currentWeight, formData.goalWeight]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentWeight) {
      newErrors.currentWeight = 'Current weight is required';
    } else if (parseFloat(formData.currentWeight) < 30 || parseFloat(formData.currentWeight) > 300) {
      newErrors.currentWeight = 'Weight must be between 30kg and 300kg';
    }

    if (!formData.goalWeight) {
      newErrors.goalWeight = 'Goal weight is required';
    } else if (parseFloat(formData.goalWeight) < 30 || parseFloat(formData.goalWeight) > 300) {
      newErrors.goalWeight = 'Weight must be between 30kg and 300kg';
    }

    if (!formData.timeframe) {
      newErrors.timeframe = 'Timeframe is required';
    }

    // Validate weekly weight change is reasonable
    if (weeklyWeightChange && Math.abs(weeklyWeightChange) > 1) {
      newErrors.timeframe = 'Weight change should not exceed 1kg per week for safety';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await updateNutritionGoals({
        currentWeight: parseFloat(formData.currentWeight),
        goalWeight: parseFloat(formData.goalWeight),
        timeframe: parseInt(formData.timeframe),
        goalType: formData.goalType,
        weeklyWeightChange: weeklyWeightChange,
        startDate: new Date().toISOString(),
        targetDate: new Date(Date.now() + parseInt(formData.timeframe) * 7 * 24 * 60 * 60 * 1000).toISOString()
      });
      toast.success('Nutrition goals set successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Failed to set nutrition goals');
    } finally {
      setLoading(false);
    }
  };

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const getGoalIcon = () => {
    switch (formData.goalType) {
      case 'lose': return <TrendingDown className="w-5 h-5 text-blue-600" />;
      case 'gain': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'maintain': return <Minus className="w-5 h-5 text-gray-600" />;
      default: return <Target className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Set Your Nutrition Goals</h1>
            <p className="text-gray-600">Define your weight goals and timeline for success</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Current Weight (kg)"
                name="currentWeight"
                type="number"
                value={formData.currentWeight}
                onChange={handleInputChange}
                error={errors.currentWeight}
                placeholder="Enter your current weight"
                icon={Weight}
                min="30"
                max="300"
                step="0.1"
                required
              />

              <FormField
                label="Goal Weight (kg)"
                name="goalWeight"
                type="number"
                value={formData.goalWeight}
                onChange={handleInputChange}
                error={errors.goalWeight}
                placeholder="Enter your goal weight"
                icon={Target}
                min="30"
                max="300"
                step="0.1"
                required
              />
            </div>

            {/* BMI Display */}
            {bmi && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Current BMI</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-800">{bmi.toFixed(1)}</span>
                  <span className={`text-sm font-medium ${getBmiCategory(bmi).color}`}>
                    {getBmiCategory(bmi).category}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-2" />
                Timeframe *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {timeframeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'timeframe', value: option.value } })}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      formData.timeframe === option.value
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {errors.timeframe && (
                <p className="mt-1 text-red-500 text-sm">{errors.timeframe}</p>
              )}
            </div>

            {/* Goal Summary */}
            {formData.currentWeight && formData.goalWeight && formData.timeframe && (
              <div className="bg-primary/5 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  {getGoalIcon()}
                  <span className="ml-2">Goal Summary</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Weight Change</p>
                    <p className="text-xl font-bold text-gray-800">
                      {(parseFloat(formData.goalWeight) - parseFloat(formData.currentWeight)).toFixed(1)}kg
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Weekly Target</p>
                    <p className="text-xl font-bold text-gray-800">
                      {weeklyWeightChange ? `${weeklyWeightChange.toFixed(2)}kg/week` : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Goal Type</p>
                    <p className="text-xl font-bold text-gray-800 capitalize">
                      {formData.goalType} Weight
                    </p>
                  </div>
                </div>

                {weeklyWeightChange && Math.abs(weeklyWeightChange) > 0.5 && (
                  <div className={`p-3 rounded-lg ${Math.abs(weeklyWeightChange) > 1 ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    <p className="text-sm">
                      {Math.abs(weeklyWeightChange) > 1 
                        ? '⚠️ This rate of weight change may be too aggressive. Consider extending your timeframe.'
                        : '💡 This is a healthy rate of weight change. Great choice!'}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="flex-1"
                onClick={() => navigate('/profile-setup')}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Setting Goals...' : 'Complete Setup'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default NutritionGoalsPage;