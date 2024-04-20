// ActivityStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ActivityScreen from './ActivityScreen';
import SpeechCheck from './Speech';
import Quiz from './Quiz';
import SCLearn from './SCLearn';
import SpinWheel from './SpinWheel';

const Stack = createStackNavigator();

const ActivityStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ActivityScreen">
      <Stack.Screen name="ActivityScreen" component={ActivityScreen} options={{ title: 'Activities' }} />
      <Stack.Screen name="SpeechCheck" component={SpeechCheck} />
      <Stack.Screen name="Quiz" component={Quiz} />
      <Stack.Screen name="SCLearn" component={SCLearn} />
      <Stack.Screen name="SpinWheel" component={SpinWheel} />
    </Stack.Navigator>
  );
};

export default ActivityStackNavigator;
