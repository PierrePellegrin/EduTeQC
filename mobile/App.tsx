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

// Screens
import {
  LoginScreen,
  CoursesListScreen,
  CourseDetailScreen,
  TestScreen,
  ProfileScreen,
  AdminDashboardScreen,
  AdminCoursesScreen,
  AdminTestsScreen,
  AdminQuestionsScreen,
  AdminPackagesScreen,
  PackagesListScreen,
} from './src/screens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

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
                } else if (route.name === 'ProfileTab') {
                  iconName = focused ? 'account' : 'account-outline';
                } else if (route.name === 'PackagesTab') {
                  iconName = focused ? 'package-variant' : 'package-variant-closed';
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
              component={PackagesListScreen}
              options={{ title: 'Packages' }}
            />
            <Tab.Screen
              name="ProfileTab"
              component={ProfileScreen}
              options={{ title: 'Profil' }}
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
        options={{ title: 'Packages' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Profil' }}
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
          <AppContent />
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
