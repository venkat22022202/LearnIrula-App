import "react-native-gesture-handler";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Home from "../Home";
import Glossary from "../Glossary";
import AboutScreen from "../About";
import ActivityStackNavigator from '../ActivityStackNavigator'; // Import the stack navigator

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#284387",
          borderBottomWidth: 0,
          borderTopWidth: 0,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#a8a8a8",
        tabBarStyle: [
          {
            display: "flex",
            backgroundColor: "#284387",
            borderTopWidth: 0,
          },
          null,
        ],
      }}
    >
      <Tab.Screen
        name="LearnIrula"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
          tabBarLabel: "Home",
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="Activitiy Screen"
        component={ActivityStackNavigator} // Use the stack navigator here
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="apps-outline" color={color} size={size} />
          ),
          tabBarLabel: "Activities",
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="Glossary"
        component={Glossary}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" color={color} size={size} />
          ),
          tabBarLabel: "Glossary",
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" color={color} size={size} />
          ),
          tabBarLabel: "About",
          headerTitleAlign: "center",
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabs;
