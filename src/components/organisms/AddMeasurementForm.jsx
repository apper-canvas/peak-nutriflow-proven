import React from 'react';
import { motion } from 'framer-motion';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const AddMeasurementForm = ({ showAddForm, onClose, onSubmit, formData, onFormChange }) => {
    if (!showAddForm) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl max-w-md w-full p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-heading font-semibold text-gray-900">Add Health Measurement</h3>
                    <Button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ApperIcon name="X" className="w-5 h-5" />
                    </Button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <FormField
                        label="Weight (kg)"
                        id="weight"
                        type="number"
                        step="0.1"
                        value={formData.weight}
                        onChange={(e) => onFormChange('weight', e.target.value)}
                        placeholder="70.5"
                        required
                    />

                    <FormField
                        label="Height (cm)"
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => onFormChange('height', e.target.value)}
                        placeholder="170"
                    />

                    <div className="grid grid-cols-3 gap-3">
                        <FormField
                            label="Waist (cm)"
                            id="waist"
                            type="number"
                            step="0.1"
                            value={formData.waist}
                            onChange={(e) => onFormChange('waist', e.target.value)}
                            placeholder="80"
                        />
                        <FormField
                            label="Hips (cm)"
                            id="hips"
                            type="number"
                            step="0.1"
                            value={formData.hips}
                            onChange={(e) => onFormChange('hips', e.target.value)}
                            placeholder="90"
                        />
                        <FormField
                            label="Arms (cm)"
                            id="arms"
                            type="number"
                            step="0.1"
                            value={formData.arms}
                            onChange={(e) => onFormChange('arms', e.target.value)}
                            placeholder="30"
                        />
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Add Measurement
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddMeasurementForm;