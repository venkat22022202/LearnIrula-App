import "react-native-gesture-handler";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Home from "../Home";
import Glossary from "../Glossary";
import AboutScreen from "../About";
import SpinWheel from "../SpinWheel";
import Quiz from "../Quiz";
import CoinTossing from "../CoinTossing";

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
            <Ionicons name="home" color={color} size={size} />
          ),
          tabBarLabel: "Home",
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen 
       name="CoinTossing" 
       component={CoinTossing} 
       options={{
         tabBarIcon: ({ color, size }) => (
           <Ionicons name="home" color={color} size={size} />
         ),
         tabBarLabel: 'Coin Toss',
         headerTitleAlign: "center",
       }} 
      />
      <Tab.Screen
        name="Glossary"
        component={Glossary}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
          tabBarLabel: "Glossary",
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="SpinWheel"
        component={SpinWheel}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="spinner" color={color} size={size} />
          ),
          tabBarLabel: "SpinWheel",
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="Quiz"
        component={Quiz}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school" color={color} size={size} />
          ),
          tabBarLabel: "Quiz",
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" color={color} size={size} />
          ),
          tabBarLabel: "About",
          headerTitleAlign: "center",
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabs;
