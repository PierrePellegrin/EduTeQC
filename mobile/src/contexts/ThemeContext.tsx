import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import {
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
} from 'react-native-paper';
import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';

// Couleurs Material Design 3 (palette bleue autour de #173278)
const customLightColors = {
  primary: '#173278',
  onPrimary: '#FFFFFF',
  primaryContainer: '#D5E1FF',
  onPrimaryContainer: '#0A1C44',
  secondary: '#2E5AAC',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#D7E3FF',
  onSecondaryContainer: '#0A1C44',
  tertiary: '#2E7DAF',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#CAE8FF',
  onTertiaryContainer: '#062A3D',
  error: 'rgb(186, 26, 26)',
  onError: 'rgb(255, 255, 255)',
  errorContainer: 'rgb(255, 218, 214)',
  onErrorContainer: 'rgb(65, 0, 2)',
  background: 'rgb(255, 251, 255)',
  onBackground: 'rgb(29, 27, 32)',
  surface: 'rgb(255, 251, 255)',
  onSurface: 'rgb(29, 27, 32)',
  surfaceVariant: 'rgb(231, 224, 236)',
  onSurfaceVariant: 'rgb(73, 69, 78)',
  outline: 'rgb(122, 117, 127)',
  outlineVariant: 'rgb(202, 196, 208)',
  shadow: 'rgb(0, 0, 0)',
  scrim: 'rgb(0, 0, 0)',
  inverseSurface: 'rgb(50, 47, 53)',
  inverseOnSurface: 'rgb(245, 239, 244)',
  inversePrimary: '#AFC6FF',
  elevation: {
    level0: 'transparent',
    level1: 'rgb(248, 242, 251)',
    level2: 'rgb(244, 236, 248)',
    level3: 'rgb(240, 231, 246)',
    level4: 'rgb(239, 229, 245)',
    level5: 'rgb(236, 226, 243)',
  },
  surfaceDisabled: 'rgba(29, 27, 32, 0.12)',
  onSurfaceDisabled: 'rgba(29, 27, 32, 0.38)',
  backdrop: 'rgba(51, 47, 56, 0.4)',
};

const customDarkColors = {
  primary: '#AFC6FF',
  onPrimary: '#0B234E',
  primaryContainer: '#173278',
  onPrimaryContainer: '#D5E1FF',
  secondary: '#B8CCFF',
  onSecondary: '#0B234E',
  secondaryContainer: '#2E5AAC',
  onSecondaryContainer: '#FFFFFF',
  tertiary: '#A5D8FF',
  onTertiary: '#00324D',
  tertiaryContainer: '#2E7DAF',
  onTertiaryContainer: '#FFFFFF',
  error: 'rgb(255, 180, 171)',
  onError: 'rgb(105, 0, 5)',
  errorContainer: 'rgb(147, 0, 10)',
  onErrorContainer: 'rgb(255, 180, 171)',
  background: 'rgb(29, 27, 32)',
  onBackground: 'rgb(231, 225, 230)',
  surface: 'rgb(29, 27, 32)',
  onSurface: 'rgb(231, 225, 230)',
  surfaceVariant: 'rgb(73, 69, 78)',
  onSurfaceVariant: 'rgb(202, 196, 208)',
  outline: 'rgb(148, 143, 153)',
  outlineVariant: 'rgb(73, 69, 78)',
  shadow: 'rgb(0, 0, 0)',
  scrim: 'rgb(0, 0, 0)',
  inverseSurface: 'rgb(231, 225, 230)',
  inverseOnSurface: 'rgb(50, 47, 53)',
  inversePrimary: '#173278',
  elevation: {
    level0: 'transparent',
    level1: 'rgb(37, 35, 42)',
    level2: 'rgb(43, 40, 48)',
    level3: 'rgb(48, 45, 55)',
    level4: 'rgb(50, 46, 56)',
    level5: 'rgb(53, 50, 60)',
  },
  surfaceDisabled: 'rgba(231, 225, 230, 0.12)',
  onSurfaceDisabled: 'rgba(231, 225, 230, 0.38)',
  backdrop: 'rgba(51, 47, 56, 0.4)',
};

const lightTheme = {
  ...MD3LightTheme,
  colors: customLightColors,
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: customDarkColors,
};

const { LightTheme: NavLightTheme, DarkTheme: NavDarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  theme: typeof lightTheme;
  navTheme: typeof NavLightTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');

  useEffect(() => {
    setIsDark(colorScheme === 'dark');
  }, [colorScheme]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? darkTheme : lightTheme;
  const baseNav = isDark ? NavDarkTheme : NavLightTheme;
  // Aligner la navigation avec les couleurs du thème Paper
  const navTheme = {
    ...baseNav,
    colors: {
      ...baseNav.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.onSurface,
      border: theme.colors.outline,
      notification: theme.colors.primary,
    },
  } as typeof baseNav;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme, navTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
