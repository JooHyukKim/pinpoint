import React from 'react';

import APP_SETTING_KEYS from '../config/localStorage/appSettingKeys';
import EXPERIMENTAL_CONFIG_KEYS from '../config/localStorage/experimentalConfigKeys';

export const useLocalStorage = <T>(key: APP_SETTING_KEYS | EXPERIMENTAL_CONFIG_KEYS, initialValue?: T) => {
  const [ storedValue, setStoredValue ] = React.useState<T>();
  
  React.useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);

      item 
        ? setStoredValue(JSON.parse(item)) 
        : initialValue && setStoredValue(initialValue) 
    } catch (error) {
      console.log(error);
      initialValue && setStoredValue(initialValue) ;
    }
  }, []);

  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [ storedValue, setValue ];
}
