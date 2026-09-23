import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from './ToastContext';

const ComparisonContext = createContext(null);

export const ComparisonProvider = ({ children }) => {
  // Empty initial state - NO hardcoded comparisons
  const [selectedHospitals, setSelectedHospitals] = useState([]);
  const [dynamicTopTwo, setDynamicTopTwoState] = useState([]);
  const [activeConditionContext, setActiveConditionContext] = useState('');

  const { addToast } = useToast();

  const addToCompare = (hospital) => {
    if (selectedHospitals.some(h => h.id === hospital.id)) {
      addToast(`${hospital.shortName || hospital.name} is already in comparison`, 'info');
      return;
    }

    if (selectedHospitals.length >= 4) {
      addToast('You can compare a maximum of 4 hospitals at a time.', 'warning');
      return;
    }

    setSelectedHospitals(prev => [...prev, hospital]);
    addToast(`Added ${hospital.shortName || hospital.name} to comparison`, 'success');
  };

  const removeFromCompare = (hospitalId) => {
    setSelectedHospitals(prev => {
      const removed = prev.find(h => h.id === hospitalId);
      if (removed) {
        addToast(`Removed ${removed.shortName || removed.name} from comparison`, 'info');
      }
      return prev.filter(h => h.id !== hospitalId);
    });
  };

  const isInCompare = (hospitalId) => {
    return selectedHospitals.some(h => h.id === hospitalId);
  };

  const clearCompare = () => {
    setSelectedHospitals([]);
    addToast('Cleared hospital comparison list', 'info');
  };

  const setDynamicTopTwo = useCallback((hospitals = [], condition = '') => {
    if (hospitals.length >= 2) {
      setDynamicTopTwoState(hospitals.slice(0, 2));
    } else {
      setDynamicTopTwoState([]);
    }
    setActiveConditionContext(condition || '');
  }, []);

  const clearDynamicTopTwo = useCallback(() => {
    setDynamicTopTwoState([]);
  }, []);

  const applyTopTwoComparison = useCallback((topTwo = null) => {
    const targets = topTwo && topTwo.length >= 2 ? topTwo.slice(0, 2) : dynamicTopTwo;
    if (targets.length >= 2) {
      setSelectedHospitals(targets);
      return true;
    }
    return false;
  }, [dynamicTopTwo]);

  return (
    <ComparisonContext.Provider
      value={{
        selectedHospitals,
        setSelectedHospitals,
        count: selectedHospitals.length,
        dynamicTopTwo,
        activeConditionContext,
        setDynamicTopTwo,
        clearDynamicTopTwo,
        applyTopTwoComparison,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
