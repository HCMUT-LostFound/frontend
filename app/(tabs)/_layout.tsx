import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#2B6CB0",
                tabBarInactiveTintColor: "#666",
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
                            name={focused ? 'home' : 'home-outline'} 
                            size={24} 
                            color={color} 
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
                            name={focused ? 'chatbubbles' : 'chatbubbles-outline'} 
                            size={24} 
                            color={color} 
                        />
                    ),
                }}
            />
            <Tabs.Screen 
                name='action' 
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ color }) => (
                        <View style={styles.middleButton}>
                            <MaterialCommunityIcons 
                                name="plus" 
                                size={32} 
                                color="white" 
                            />
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
                            name={focused ? 'notifications' : 'notifications-outline'} 
                            size={24} 
                            color={color} 
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
                            name={focused ? 'person' : 'person-outline'} 
                            size={24} 
                            color={color} 
                        />
                    ),
                }}
            />
        </Tabs>
    )
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const isMiddle = index === 2; // Middle tab (action)
        const isFocused = state.index === index;
        const label = descriptors[route.key]?.options?.tabBarLabel || '';

        const onPress = () => {
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
          color: isFocused ? '#2B6CB0' : '#666',
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
                      { color: isFocused ? '#2B6CB0' : '#666' }
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
        height: 70,
        backgroundColor: 'white',
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
        marginTop: -20,
    },
    middleButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
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
    },
});