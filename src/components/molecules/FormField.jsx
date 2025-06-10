import React from 'react';
import Input from '@/components/atoms/Input';

const FormField = ({ label, id, value, onChange, type = 'text', placeholder, required = false, step, className }) => {
    return (
        <div className={className}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && '*'}
            </label>
            <Input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                step={step}
            />
        </div>
    );
};

export default FormField;