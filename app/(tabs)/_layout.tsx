import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "blue",
            }}
            tabBar={(props) => <CustomTabBar {...props} />}
        >
            <Tabs.Screen name='home' options={{
                tabBarLabel:'Home',
                tabBarIcon:({color})=><Feather name="home" size={24} color={color} />
            }}/>
            <Tabs.Screen name='chat' options={{
                tabBarLabel:'Chat',
                tabBarIcon:({color})=><Ionicons name="chatbubble-outline" size={24} color={color} />
            }}/>
            <Tabs.Screen name='action' />
            <Tabs.Screen name='notification' options={{
                tabBarLabel:'Notification',
                tabBarIcon:({color})=><Ionicons name="notifications-outline" size={24} color={color} />
            }}/>
            <Tabs.Screen name='profile' options={{
                tabBarLabel:'Profile',
                tabBarIcon:({color})=><Ionicons name="person-circle" size={24} color={color} />
            }}/>
        </Tabs>
    )
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const isMiddle = index === 2; // Tab giữa (action)
        const isFocused = state.index === index;

        const onPress = () => navigation.navigate(route.name);

        // Lấy icon từ descriptors
        const icon =
          isMiddle
            ? "+"
            : descriptors[route.key]?.options?.tabBarIcon?.({
                color: isFocused ? "blue" : "gray",
                size: 24,
              });

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={isMiddle ? styles.middleButton : styles.tabButton}
          >
            {typeof icon === "string" ? (
              <Text style={{ color: isFocused ? "blue" : "gray", fontSize: 24 }}>
                {icon}
              </Text>
            ) : (
              icon
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: "row",
        height: 70,
        backgroundColor: "white",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 10,
        borderTopWidth: 0.5,
        borderTopColor: "#ccc",
    },
    tabButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    middleButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "orange",
        alignItems: "center",
        justifyContent: "center",
        marginTop: -20, // nổi lên
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
});