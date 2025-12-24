import { ActionModalProvider, useActionModal } from '@/contexts/ActionModalContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function TabLayout() {
  return (
    <ActionModalProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#2B6CB0",
          tabBarInactiveTintColor: "black",
          // tabBarActiveBackgroundColor: 'transparent',
          // tabBarInactiveBackgroundColor: 'transparent',
          tabBarShowLabel: true,
          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
            paddingTop: 8,
            backgroundColor: '#fff',
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 4,
          },
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen
          name='home'
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home-outline" : "home-outline"}
                size={24}
                color={focused ? '#2B6CB0' : 'black'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='chat'
          options={{
            tabBarLabel: 'Chat',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "chatbubble-outline" : "chatbubble-outline"}
                size={24}
                color={focused ? '#2B6CB0' : 'black'}
              />
            ),

          }}
        />
        <Tabs.Screen
          name='action'
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.middleButton}>
                <Ionicons name="add" size={24} color="white" />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name='notification'
          options={{
            tabBarLabel: 'Notification',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "notifications-outline" : "notifications-outline"}
                size={24}
                color={focused ? '#2B6CB0' : 'black'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "person-circle-outline" : "person-circle-outline"}
                size={24}
                color={focused ? '#2B6CB0' : 'black'}
              />
            ),
          }}
        />
      </Tabs>
    </ActionModalProvider>
  )
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const { showModal } = useActionModal();

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const isMiddle = index === 2; // Middle tab (action)
        const isFocused = state.index === index;
        const label = descriptors[route.key]?.options?.tabBarLabel || '';

        const onPress = () => {
          // If it's the action button, show modal instead of navigating
          if (isMiddle) {
            showModal();
            return;
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const icon = descriptors[route.key]?.options?.tabBarIcon?.({
          color: isFocused ? '#2B6CB0' : 'black',
          size: 24,
          focused: isFocused,
        });

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={isMiddle ? styles.middleButtonContainer : styles.tabButton}
            activeOpacity={0.7}
          >
            {isMiddle ? (
              <View style={styles.middleButton}>
                {icon}
              </View>
            ) : (
              <View style={styles.tabButtonContent}>
                {icon}
                {label !== '' && (
                  <Text
                    style={[
                      styles.tabLabel,
                      { color: isFocused ? '#2B6CB0' : 'black' }
                    ]}
                  >
                    {label}
                  </Text>
                )}
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 89.5,
    backgroundColor: 'white',
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleButtonContainer: {
    width: width / 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
  },
  middleButton: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: '#2B6CB0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'System',
    color: 'black',
  },
});