import { useState, useCallback, useEffect } from "react";

// version that runs for us automatically
export const useAsync = (func, dependencies = []) => {
  const { execute, ...state } = useAsyncInternal(func, dependencies, true);

  useEffect(() => {
    execute();
  }, [execute]);

  // state is value, error and loading
  return state;
};

// version that returns a function we can call
export const useAsyncFunction = (func, dependencies = []) => {
  return useAsyncInternal(func, dependencies, false);
};

const useAsyncInternal = (func, dependencies, initialLoading = false) => {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState();
  const [value, setValue] = useState();

  const execute = useCallback((...params) => {
    // loading to true as we are running something
    setLoading(true);
    // for example, func is getPosts passed into useAsync, which in that case it has no params
    return func(...params)
      .then((data) => {
        setValue(data);
        // if we reached this point there's no error
        setError(undefined);
        return data;
      })
      .catch((err) => {
        setValue(undefined);
        setError(err);
        return Promise.reject(err);
      })
      .finally(() => {
        // loading false as the function has now run
        setLoading(false);
      });
    // only refresh function when dependencies change, if any
  }, dependencies);

  return { loading, error, value, execute };
};
