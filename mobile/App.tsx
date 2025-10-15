import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';

// Screens
import { LoginScreen } from './src/screens/LoginScreen';
import { CoursesListScreen } from './src/screens/CoursesListScreen';
import { CourseDetailScreen } from './src/screens/CourseDetailScreen';
import { TestScreen } from './src/screens/TestScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { AdminDashboardScreen } from './src/screens/AdminDashboardScreen';
import { AdminTestsScreen } from './src/screens/AdminTestsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

function ClientTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'home';

          if (route.name === 'CoursesTab') {
            iconName = focused ? 'book-open' : 'book-open-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="CoursesTab"
        component={CoursesStack}
        options={{ title: 'Cours' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
}

function CoursesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CoursesList"
        component={CoursesListScreen}
        options={{ title: 'Mes Cours' }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{ title: 'Détails du cours' }}
      />
      <Stack.Screen
        name="TestDetail"
        component={TestScreen}
        options={{ title: 'Test' }}
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
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={AdminDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="CoursesAdminTab"
        component={CoursesStack}
        options={{ title: 'Cours', headerShown: false }}
      />
      <Tab.Screen
        name="TestsAdminTab"
        component={AdminTestsScreen}
        options={{ title: 'Tests' }}
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
  const { user, loading } = useAuth();

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

  if (user.role === 'ADMIN') {
    return <AdminTabs />;
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
  const { theme, navTheme } = useTheme();

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <NavigationContainer theme={navTheme}>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}
