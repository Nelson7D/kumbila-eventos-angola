
import { useState } from 'react';

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  email?: boolean;
}

interface FieldRules {
  [key: string]: ValidationRules;
}

export interface FormErrors {
  [key: string]: string;
}

export function useFormValidation<T extends Record<string, any>>(initialValues: T, rules: FieldRules) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(rules).forEach((field) => {
      const value = values[field];
      const fieldRules = rules[field];

      // Verificar campo obrigatório
      if (fieldRules.required && (!value || value === '')) {
        newErrors[field] = 'Este campo é obrigatório';
        isValid = false;
        return;
      }

      // Verificar comprimento mínimo
      if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
        newErrors[field] = `Este campo deve ter pelo menos ${fieldRules.minLength} caracteres`;
        isValid = false;
        return;
      }

      // Verificar se é um email válido
      if (fieldRules.email && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field] = 'Digite um endereço de e-mail válido';
          isValid = false;
          return;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });

    // Limpar erro do campo quando ele é alterado
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (callback: (values: T) => Promise<void>) => {
    setIsSubmitting(true);
    
    if (validate()) {
      try {
        await callback(values);
      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
      }
    }
    
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setValues,
  };
}
