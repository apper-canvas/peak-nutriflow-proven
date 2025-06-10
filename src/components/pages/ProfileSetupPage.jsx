import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { User, Calendar, Ruler, Activity } from 'lucide-react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import { useAuth } from '@/hooks/useAuth';

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    height: '',
    activityLevel: ''
  });
  const [errors, setErrors] = useState({});

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'lightly_active', label: 'Lightly active (light exercise 1-3 days/week)' },
    { value: 'moderately_active', label: 'Moderately active (moderate exercise 3-5 days/week)' },
    { value: 'very_active', label: 'Very active (hard exercise 6-7 days/week)' },
    { value: 'extremely_active', label: 'Extremely active (very hard exercise, physical job)' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (parseInt(formData.age) < 13 || parseInt(formData.age) > 120) {
      newErrors.age = 'Age must be between 13 and 120';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.height) {
      newErrors.height = 'Height is required';
    } else if (parseInt(formData.height) < 100 || parseInt(formData.height) > 250) {
      newErrors.height = 'Height must be between 100cm and 250cm';
    }

    if (!formData.activityLevel) {
      newErrors.activityLevel = 'Activity level is required';
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
      await updateProfile({
        ...formData,
        age: parseInt(formData.age),
        height: parseInt(formData.height)
      });
      toast.success('Profile updated successfully!');
      navigate('/nutrition-goals');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
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
              <User className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Profile</h1>
            <p className="text-gray-600">Help us personalize your nutrition experience</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="First Name"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                placeholder="Enter your first name"
                icon={User}
                required
              />

              <FormField
                label="Last Name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                placeholder="Enter your last name"
                icon={User}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                error={errors.age}
                placeholder="Enter your age"
                icon={Calendar}
                min="13"
                max="120"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['male', 'female', 'other'].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => handleInputChange({ target: { name: 'gender', value: gender } })}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        formData.gender === gender
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-primary'
                      }`}
                    >
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </button>
                  ))}
                </div>
                {errors.gender && (
                  <p className="mt-1 text-red-500 text-sm">{errors.gender}</p>
                )}
              </div>
            </div>

            <FormField
              label="Height (cm)"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleInputChange}
              error={errors.height}
              placeholder="Enter your height in centimeters"
              icon={Ruler}
              min="100"
              max="250"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Activity className="inline w-4 h-4 mr-2" />
                Activity Level *
              </label>
              <div className="space-y-2">
                {activityLevels.map((level) => (
                  <label key={level.value} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-primary cursor-pointer">
                    <input
                      type="radio"
                      name="activityLevel"
                      value={level.value}
                      checked={formData.activityLevel === level.value}
                      onChange={handleInputChange}
                      className="text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{level.label}</span>
                  </label>
                ))}
              </div>
              {errors.activityLevel && (
                <p className="mt-1 text-red-500 text-sm">{errors.activityLevel}</p>
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="flex-1"
                onClick={() => navigate('/login')}
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
                {loading ? 'Saving...' : 'Continue'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSetupPage;