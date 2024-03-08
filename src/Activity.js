// In your ActivitySection.js file
import React from "react";
import { View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ActivitySection = () => {
  const navigation = useNavigation();

  const handleSpinWheelPress = () => {
    navigation.navigate("SpinWheel");
  };

  const handleQuizPress = () => {
    navigation.navigate("Quiz");
  };

  return (
    <View>
      <CustomButton title="Spin Wheel" onPress={handleSpinWheelPress} />
      <CustomButton title="Quiz" onPress={handleQuizPress} />
    </View>
  );
};

const CustomButton = ({ title, onPress }) => {
  return <Button title={title} onPress={onPress} />;
};

export default ActivitySection;
