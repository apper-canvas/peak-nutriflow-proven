import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className, onClick, type = 'button', disabled = false, ...motionProps }) => {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            className={className}
            disabled={disabled}
            {...motionProps}
        >
            {children}
        </motion.button>
    );
};

export default Button;