import type { FormItemRule } from 'element-plus';

export const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const useValidator = () => {
  const required = (message?: string): FormItemRule => {
    return {
      required: true,
      message: message || 'This is required field!'
    };
  };

  const trimRequired = (message?: string): FormItemRule[] => {
    return [
      {
        required: true,
        message: message || 'This is required field!'
      },
      {
        validator: (_, val, callback) => {
          if (!val || (typeof val === 'string' && !val.trim())) {
            callback(message || 'This is required field!');
          } else {
            callback();
          }
        }
      }
    ];
  };

  const guid = (message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (!guidRegex.test(val?.trim())) {
          callback(message || 'Input must following guid format!');
        } else {
          callback();
        }
      }
    };
  };
  return {
    required,
    trimRequired,
    guid
  };
};
