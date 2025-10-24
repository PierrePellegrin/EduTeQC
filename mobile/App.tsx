import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { SettingsProvider } from './src/contexts/SettingsContext';

// Screens
import {
  LoginScreen,
  CoursesListScreen,
  CourseDetailScreen,
  TestScreen,
  ProfileScreen,
  SettingsScreen,
  AdminDashboardScreen,
  AdminCoursesScreen,
  AdminTestsScreen,
  AdminQuestionsScreen,
  AdminPackagesScreen,
  PackagesListScreen,
  ResultsScreen,
} from './src/screens';
import { PackageDetailScreen } from './src/screens/packages/PackageDetailScreen';
import { PackagesShopScreen } from './src/screens/packages/PackagesShopScreen';
import { CourseSectionsScreen } from './src/screens/CourseSectionsScreen';
import { SectionDetailScreen } from './src/screens/SectionDetailScreen';
import { CourseSectionsEditorScreen } from './src/screens/admin/CourseSectionsEditorScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

function ProfileStack() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.headerBackground,
        },
        headerTintColor: theme.colors.onHeaderBackground,
        headerTitleStyle: {
          color: theme.colors.onHeaderBackground,
        },
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen as React.ComponentType<any>}
        options={{ title: 'Profil', headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen as React.ComponentType<any>}
        options={{ title: 'Paramètres' }}
      />
    </Stack.Navigator>
  );
}

function ClientTabs() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" options={{ headerShown: false }}>
        {() => (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: string = 'home';
                if (route.name === 'CoursesTab') {
                  iconName = focused ? 'book-open' : 'book-open-outline';
                } else if (route.name === 'PackagesTab') {
                  iconName = focused ? 'package-variant' : 'package-variant-closed';
                } else if (route.name === 'ResultsTab') {
                  iconName = focused ? 'chart-line' : 'chart-line';
                } else if (route.name === 'ProfileTab') {
                  iconName = focused ? 'account' : 'account-outline';
                }
                return <Icon name={iconName as any} size={size} color={color} />;
              },
              tabBarActiveTintColor: theme.colors.onHeaderBackground,
              tabBarInactiveTintColor: theme.colors.tabBarInactiveTint,
              tabBarStyle: {
                backgroundColor: theme.colors.headerBackground,
                borderTopColor: theme.colors.outlineVariant,
              },
              tabBarLabelStyle: {
                marginBottom: 4,
              },
              headerStyle: {
                backgroundColor: theme.colors.headerBackground,
              },
              headerTintColor: theme.colors.onHeaderBackground,
              headerTitleStyle: {
                color: theme.colors.onHeaderBackground,
              },
            })}
          >
            <Tab.Screen
              name="CoursesTab"
              component={CoursesStack}
              options={{ title: 'Cours', headerShown: false }}
            />
            <Tab.Screen
              name="PackagesTab"
              component={PackagesStack}
              options={{ title: 'Forfaits', headerShown: false }}
            />
            <Tab.Screen
              name="ResultsTab"
              component={ResultsScreen}
              options={{ title: 'Résultats' }}
            />
            <Tab.Screen
              name="ProfileTab"
              component={ProfileStack}
              options={{ title: 'Profil', headerShown: false }}
            />
          </Tab.Navigator>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function CoursesStack() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.headerBackground,
        },
        headerTintColor: theme.colors.onHeaderBackground,
        headerTitleStyle: {
          color: theme.colors.onHeaderBackground,
        },
      }}
    >
      <Stack.Screen
        name="CoursesList"
        component={CoursesListScreen as React.ComponentType<any>}
        options={{ title: 'Mes Cours' }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen as React.ComponentType<any>}
        options={{ title: 'Détails du cours' }}
      />
      <Stack.Screen
        name="CourseSections"
        component={CourseSectionsScreen as React.ComponentType<any>}
        options={{ title: 'Sections du cours' }}
      />
      <Stack.Screen
        name="SectionDetail"
        component={SectionDetailScreen as React.ComponentType<any>}
        options={{ title: 'Section' }}
      />
      <Stack.Screen
        name="TestDetail"
        component={TestScreen as React.ComponentType<any>}
        options={{ title: 'Test' }}
      />
    </Stack.Navigator>
  );
}

function PackagesStack() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.headerBackground,
        },
        headerTintColor: theme.colors.onHeaderBackground,
        headerTitleStyle: {
          color: theme.colors.onHeaderBackground,
        },
      }}
    >
      <Stack.Screen
        name="PackagesList"
        component={PackagesListScreen as React.ComponentType<any>}
        options={{ title: 'Forfaits' }}
      />
      <Stack.Screen
        name="PackagesShop"
        component={PackagesShopScreen as React.ComponentType<any>}
        options={{ title: 'Acheter des forfaits' }}
      />
      <Stack.Screen
        name="PackageDetail"
        component={PackageDetailScreen as React.ComponentType<any>}
        options={{ title: 'Détails du forfait' }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen as React.ComponentType<any>}
        options={{ title: 'Détails du cours' }}
      />
      <Stack.Screen
        name="CourseSections"
        component={CourseSectionsScreen as React.ComponentType<any>}
        options={{ title: 'Sections du cours' }}
      />
      <Stack.Screen
        name="SectionDetail"
        component={SectionDetailScreen as React.ComponentType<any>}
        options={{ title: 'Section' }}
      />
      <Stack.Screen
        name="TestDetail"
        component={TestScreen as React.ComponentType<any>}
        options={{ title: 'Test' }}
      />
    </Stack.Navigator>
  );
}

function AdminCoursesStack() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.headerBackground,
        },
        headerTintColor: theme.colors.onHeaderBackground,
        headerTitleStyle: {
          color: theme.colors.onHeaderBackground,
        },
      }}
    >
      <Stack.Screen
        name="CoursesList"
        component={AdminCoursesScreen}
        options={{ title: 'Gestion des Cours' }}
      />
      <Stack.Screen
        name="CourseSectionsEditor"
        component={CourseSectionsEditorScreen as React.ComponentType<any>}
        options={{ title: 'Éditer les sections' }}
      />
    </Stack.Navigator>
  );
}

function TestsStack() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.headerBackground,
        },
        headerTintColor: theme.colors.onHeaderBackground,
        headerTitleStyle: {
          color: theme.colors.onHeaderBackground,
        },
      }}
    >
      <Stack.Screen
        name="TestsList"
        component={AdminTestsScreen as React.ComponentType<any>}
        options={{ title: 'Gestion des Tests' }}
      />
      <Stack.Screen
        name="AdminQuestions"
        component={AdminQuestionsScreen as React.ComponentType<any>}
        options={{ title: 'Questions' }}
      />
    </Stack.Navigator>
  );
}

function AdminTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'home';

          if (route.name === 'DashboardTab') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'CoursesAdminTab') {
            iconName = focused ? 'book-open' : 'book-open-outline';
          } else if (route.name === 'TestsAdminTab') {
            iconName = focused ? 'file-document' : 'file-document-outline';
          } else if (route.name === 'PackagesTab') {
            iconName = focused ? 'package-variant' : 'package-variant-closed';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <Icon name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.onHeaderBackground,
        tabBarInactiveTintColor: theme.colors.tabBarInactiveTint,
        tabBarStyle: {
          backgroundColor: theme.colors.headerBackground,
          borderTopColor: theme.colors.outlineVariant,
        },
        tabBarLabelStyle: {
          marginBottom: 4,
        },
        headerStyle: {
          backgroundColor: theme.colors.headerBackground,
        },
        headerTintColor: theme.colors.onHeaderBackground,
        headerTitleStyle: {
          color: theme.colors.onHeaderBackground,
        },
        headerShadowVisible: true,
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={AdminDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="CoursesAdminTab"
        component={AdminCoursesStack}
        options={{ title: 'Cours', headerShown: false }}
      />
      <Tab.Screen
        name="TestsAdminTab"
        component={TestsStack}
        options={{ title: 'Tests', headerShown: false }}
      />
      <Tab.Screen
        name="PackagesTab"
        component={AdminPackagesScreen}
        options={{ title: 'Forfaits' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: 'Profil', headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading, isAdminMode } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  // Si l'utilisateur est admin, afficher la vue selon isAdminMode
  if (user.role === 'ADMIN') {
    return isAdminMode ? <AdminTabs /> : <ClientTabs />;
  }

  return <ClientTabs />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <SettingsProvider>
            <AppContent />
          </SettingsProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { theme, navTheme, isDark } = useTheme();

  return (
    <PaperProvider theme={theme}>
      <StatusBar 
        style="light" 
        backgroundColor={theme.colors.statusBarBackground}
      />
      <AuthProvider>
        <NavigationContainer theme={navTheme}>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}
