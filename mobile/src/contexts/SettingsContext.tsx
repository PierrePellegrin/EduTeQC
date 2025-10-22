import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsContextType = {
  showImages: boolean;
  toggleShowImages: () => void;
  isLoading: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showImages, setShowImages] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les préférences au démarrage
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedShowImages = await AsyncStorage.getItem('settings_showImages');
      if (savedShowImages !== null) {
        setShowImages(JSON.parse(savedShowImages));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowImages = async () => {
    try {
      const newValue = !showImages;
      setShowImages(newValue);
      await AsyncStorage.setItem('settings_showImages', JSON.stringify(newValue));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ showImages, toggleShowImages, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings doit être utilisé à l\'intérieur d\'un SettingsProvider');
  }
  return context;
};
