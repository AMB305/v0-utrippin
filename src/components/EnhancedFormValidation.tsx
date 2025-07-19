import React, { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ValidationRule {
  test: (value: any) => boolean;
  message: string;
}

interface FormFieldProps {
  name: string;
  value: any;
  rules?: ValidationRule[];
  children: React.ReactNode;
  showSuccess?: boolean;
}

interface FormValidationProps {
  children: React.ReactNode;
  onSubmit: (data: Record<string, any>) => void;
  className?: string;
}

export const FormField = ({ name, value, rules = [], children, showSuccess = false }: FormFieldProps) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  const validateField = () => {
    const fieldErrors = rules
      .filter(rule => !rule.test(value))
      .map(rule => rule.message);
    
    setErrors(fieldErrors);
    setTouched(true);
    return fieldErrors.length === 0;
  };

  const isValid = errors.length === 0 && touched && value;
  const hasErrors = errors.length > 0 && touched;

  return (
    <div className="space-y-2">
      <div className="relative">
        {children}
        {showSuccess && isValid && (
          <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
        )}
        {hasErrors && (
          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-destructive" />
        )}
      </div>
      
      {hasErrors && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <Alert key={index} variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
};

export const FormValidation = ({ children, onSubmit, className = "" }: FormValidationProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      {children}
    </form>
  );
};

// Common validation rules
export const validationRules = {
  required: (message = "This field is required"): ValidationRule => ({
    test: (value) => value !== undefined && value !== null && value !== "",
    message
  }),
  
  minLength: (min: number, message?: string): ValidationRule => ({
    test: (value) => value && value.length >= min,
    message: message || `Minimum ${min} characters required`
  }),
  
  email: (message = "Please enter a valid email address"): ValidationRule => ({
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message
  }),
  
  date: (message = "Please select a valid date"): ValidationRule => ({
    test: (value) => value instanceof Date || (value && !isNaN(new Date(value).getTime())),
    message
  }),
  
  futureDate: (message = "Date must be in the future"): ValidationRule => ({
    test: (value) => {
      const date = value instanceof Date ? value : new Date(value);
      return date > new Date();
    },
    message
  })
};