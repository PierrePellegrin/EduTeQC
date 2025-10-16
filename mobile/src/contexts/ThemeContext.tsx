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

// Couleurs Material Design 3 (palette bleue cohérente autour de #07457e)
const customLightColors = {
  primary: '#07457e',
  onPrimary: '#FFFFFF',
  primaryContainer: '#D6E4FF',
  onPrimaryContainer: '#0A1B3F',
  surfaceTint: '#07457e',
  secondary: '#396a98',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#D9E2F7',
  onSecondaryContainer: '#0F1E37',
  tertiary: '#83a2bf',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#CBEAF5',
  onTertiaryContainer: '#052B3A',
  error: 'rgb(186, 26, 26)',
  onError: 'rgb(255, 255, 255)',
  errorContainer: 'rgb(255, 218, 214)',
  onErrorContainer: 'rgb(65, 0, 2)',
  background: '#F6F9FF',
  onBackground: '#0E1422',
  surface: '#FFFFFF',
  onSurface: '#0E1422',
  surfaceVariant: '#E3EAF6',
  onSurfaceVariant: '#445168',
  outline: '#8C98AA',
  outlineVariant: '#CFD7E6',
  shadow: 'rgb(0, 0, 0)',
  scrim: 'rgb(0, 0, 0)',
  inverseSurface: '#0F172A',
  inverseOnSurface: '#E5ECF8',
  inversePrimary: '#396a98',
  elevation: {
    level0: 'transparent',
    level1: '#F7FAFF',
    level2: '#F1F6FF',
    level3: '#ECF2FF',
    level4: '#E7EEFF',
    level5: '#E2EAFF',
  },
  surfaceDisabled: 'rgba(14, 20, 34, 0.12)',
  onSurfaceDisabled: 'rgba(14, 20, 34, 0.38)',
  backdrop: 'rgba(13, 31, 71, 0.35)',
  // Couleurs de succès
  successContainer: '#C8E6C9',
  onSuccessContainer: '#1B5E20',
  // Couleurs custom pour header/tab bars
  headerBackground: '#396a98',
  onHeaderBackground: '#FFFFFF',
  tabBarInactiveTint: 'rgba(255, 255, 255, 0.6)',
  // Couleur custom pour les cards
  cardBackground: '#e6ecf2',
  onCardBackground: '#0E1422',
  // Couleurs custom pour actions
  logoutColor: '#D32F2F',
  badgeBackground: '#07457e',
  // Couleurs custom pour système
  statusBarBackground: '#396a98',
  // Couleur transparente
  transparent: 'transparent',
};

const customDarkColors = {
  primary: '#517da5',
  onPrimary: '#0C1E45',
  primaryContainer: '#07457e',
  onPrimaryContainer: '#D6E4FF',
  surfaceTint: '#07457e',
  secondary: '#396a98',
  onSecondary: '#0E1A2E',
  secondaryContainer: '#396a98',
  onSecondaryContainer: '#FFFFFF',
  tertiary: '#82a2bf',
  onTertiary: '#042331',
  tertiaryContainer: '#83a2bf',
  onTertiaryContainer: '#FFFFFF',
  error: 'rgb(255, 180, 171)',
  onError: 'rgb(105, 0, 5)',
  errorContainer: 'rgb(147, 0, 10)',
  onErrorContainer: 'rgb(255, 180, 171)',
  background: '#0B1220',
  onBackground: '#E5ECF8',
  surface: '#0F1724',
  onSurface: '#E5ECF8',
  surfaceVariant: '#1A2436',
  onSurfaceVariant: '#B9C2D3',
  outline: '#4A5669',
  outlineVariant: '#2A3547',
  shadow: 'rgb(0, 0, 0)',
  scrim: 'rgb(0, 0, 0)',
  inverseSurface: '#E5ECF8',
  inverseOnSurface: '#0F1724',
  inversePrimary: '#07457e',
  elevation: {
    level0: 'transparent',
    level1: '#111827',
    level2: '#0F1B3A',
    level3: '#0D1A36',
    level4: '#0D1832',
    level5: '#0C162E',
  },
  surfaceDisabled: 'rgba(229, 236, 248, 0.12)',
  onSurfaceDisabled: 'rgba(229, 236, 248, 0.38)',
  backdrop: 'rgba(4, 10, 24, 0.5)',
  // Couleurs de succès
  successContainer: '#2E7D32',
  onSuccessContainer: '#C8E6C9',
  // Couleurs custom pour header/tab bars
  headerBackground: '#04294c',
  onHeaderBackground: '#FFFFFF',
  tabBarInactiveTint: 'rgba(255, 255, 255, 0.6)',
  // Couleur custom pour les cards
  cardBackground: '#031c32',
  onCardBackground: '#FFFFFF',
  // Couleurs custom pour actions
  logoutColor: '#FF6B6B',
  badgeBackground: '#517da5',
  // Couleurs custom pour système
  statusBarBackground: '#04294c',
  // Couleur transparente
  transparent: 'transparent',
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
