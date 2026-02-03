import { ref } from 'vue';

export const useLoading = (defaultLoading = false) => {
  const loading = ref(defaultLoading);

  const execute = async <T>(func: T): Promise<T> => {
    loading.value = true;
    try {
      if (typeof func === 'function') {
        return await func();
      }
      return await func;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    execute
  };
};
