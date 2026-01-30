import type { FormItemRule } from 'element-plus';

export const useValidator = () => {
  const required = (message?: string): FormItemRule => {
    return {
      required: true,
      message: message || 'This is required field!'
    };
  };

  const trimRequired = (message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (!val || (typeof val === 'string' && !val.trim())) {
          callback(message || 'This is required field!');
        } else {
          callback();
        }
      }
    };
  };

  return {
    required,
    trimRequired
  };
};
