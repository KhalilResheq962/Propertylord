import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { Home, List, PlusCircle, User } from 'lucide-react-native';

import HomeScreen from '../screens/HomeScreen';
import PropertyDetailsScreen from '../screens/PropertyDetailsScreen';
import AIResultsScreen from '../screens/AIResultsScreen';
import { theme } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="Details" component={PropertyDetailsScreen} />
    <Stack.Screen name="AIResults" component={AIResultsScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#ff6b00',
            tabBarInactiveTintColor: '#64748b',
            headerShown: false,
            tabBarStyle: {
              height: 70,
              backgroundColor: '#ffffff',
              borderTopWidth: 1,
              borderTopColor: '#f1f5f9',
            }
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeStack} 
            options={{
              tabBarIcon: ({ color, size }) => <Home size={size} color={color} />
            }}
          />
          <Tab.Screen 
            name="Listings" 
            component={HomeScreen} 
            options={{
              tabBarIcon: ({ color, size }) => <List size={size} color={color} />
            }}
          />
          <Tab.Screen 
            name="Add" 
            component={HomeScreen} 
            options={{
              tabBarIcon: ({ color, size }) => <PlusCircle size={size} color={color} />
            }}
          />
          <Tab.Screen 
            name="Profile" 
            component={HomeScreen} 
            options={{
              tabBarIcon: ({ color, size }) => <User size={size} color={color} />
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default AppNavigator;
