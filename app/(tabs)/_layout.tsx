import React from 'react';
import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Home from './index';
import OCR from './ocr';
import Speech from './speech';
import Account from './account';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        }}
        tabBar={({ navigation, state, descriptors, insets }) => (
          <BottomNavigation.Bar
            navigationState={state}
            safeAreaInsets={insets}
            style={{ height: 80 }}
            onTabPress={({ route, preventDefault }) => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (event.defaultPrevented) {
                preventDefault();
              } else {
                navigation.dispatch({
                  ...CommonActions.navigate(route.name, route.params),
                  target: state.key,
                });
              }
            }}
            renderIcon={({ route, focused, color }) => {
              const { options } = descriptors[route.key];
              if (options.tabBarIcon) {
                return options.tabBarIcon({ focused, color, size: 24 });
              }

              return null;
            }}
          />
        )}
      >
        <Tab.Screen
          name="index"
          component={Home}
          options={{
            tabBarIcon: ({ color, size }) => {
              return <MaterialCommunityIcons name="translate" size={size} color={color} />;
            },
          }}
        />
        <Tab.Screen
          name="ocr"
          component={OCR}
          options={{
            tabBarIcon: ({ color, size }) => {
              return <MaterialCommunityIcons name="camera-outline" size={size} color={color} />;
            },
          }}
        />
        <Tab.Screen
          name="voice"
          component={Speech}
          options={{
            tabBarIcon: ({ color, size }) => {
              return <MaterialIcons name="keyboard-voice" size={size} color={color} />;
            },
          }}
        />
        <Tab.Screen
          name="account"
          component={Account}
          options={{
            tabBarIcon: ({ color, size }) => {
              return <MaterialCommunityIcons name="account-outline" size={size} color={color} />;
            },
          }}
        />
      </Tab.Navigator>
    </>
  );
}
