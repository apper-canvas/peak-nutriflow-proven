import React from 'react';

const Input = ({
    value,
    onChange,
    type = 'text',
    placeholder,
    className,
    step,
    required = false,
    id,
    name,
    disabled = false,
    ...rest
}) => {
    return (
        <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${className || ''}`}
            step={step}
            required={required}
            disabled={disabled}
            {...rest}
        />
    );
};

export default Input;