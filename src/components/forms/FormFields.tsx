import React, { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';

interface BaseFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
}

interface InputProps extends BaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'datetime-local';
}

interface TextareaProps extends BaseFieldProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {}

interface SelectProps extends BaseFieldProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

interface CheckboxProps extends BaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  label: string;
}

interface RadioGroupProps extends BaseFieldProps {
  name: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value: string;
  onChange: (value: string) => void;
}

// Input Field Component
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, helpText, className = '', ...props }, ref) => {
    const inputId = props.id || `input-${props.name || Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className={`space-y-1 ${className}`}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={`
              block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${error 
                ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300'
              }
            `}
            {...props}
          />
          
          {error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p className="text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea Field Component
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, helpText, className = '', ...props }, ref) => {
    const textareaId = props.id || `textarea-${props.name || Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className={`space-y-1 ${className}`}>
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            className={`
              block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              resize-vertical
              ${error 
                ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300'
              }
            `}
            {...props}
          />
          
          {error && (
            <div className="absolute top-2 right-2 flex items-center pointer-events-none">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p className="text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select Field Component
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, required, helpText, options, placeholder, className = '', ...props }, ref) => {
    const selectId = props.id || `select-${props.name || Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className={`space-y-1 ${className}`}>
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              block w-full px-3 py-2 border rounded-md shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${error 
                ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300'
              }
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          {error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p className="text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Checkbox Field Component
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, required, helpText, className = '', ...props }, ref) => {
    const checkboxId = props.id || `checkbox-${props.name || Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className={`space-y-1 ${className}`}>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              className={`
                h-4 w-4 rounded border-gray-300 text-blue-600
                focus:ring-2 focus:ring-blue-500
                disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                ${error ? 'border-red-300' : ''}
              `}
              {...props}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor={checkboxId} className="text-gray-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        </div>
        
        {error && (
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p className="text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// Radio Group Component
export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  error,
  required,
  helpText,
  name,
  options,
  value,
  onChange,
  className = '',
}) => {
  const groupId = `radio-group-${name}`;
  
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </legend>
        </fieldset>
      )}
      
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${groupId}-${option.value}`}
              name={name}
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              disabled={option.disabled}
              className={`
                h-4 w-4 text-blue-600 border-gray-300
                focus:ring-2 focus:ring-blue-500
                disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                ${error ? 'border-red-300' : ''}
              `}
            />
            <label
              htmlFor={`${groupId}-${option.value}`}
              className={`ml-2 text-sm ${
                option.disabled ? 'text-gray-400' : 'text-gray-700'
              }`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

// Form Group Component
interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({ children, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
};

// Form Section Component
interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

// Form Actions Component
interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};
