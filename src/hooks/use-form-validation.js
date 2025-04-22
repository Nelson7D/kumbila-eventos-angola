
import { useState } from 'react';

/**
 * @typedef {Object.<string, string>} FormErrors
 */

/**
 * Custom hook for form validation
 * @template T
 * @param {T} initialValues - Initial form values
 * @param {Object.<string, Object>} rules - Validation rules
 * @returns {Object} Form validation utilities
 */
export function useFormValidation(initialValues, rules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
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

  const handleChange = (e) => {
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

  const handleSubmit = async (callback) => {
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
