import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

function ActivityScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activities</Text>
      <Button
        title="Check Speech"
        onPress={() => navigation.navigate('SpeechCheck')} // Ensure 'SpeechCheck' is correctly registered in your stack navigator
      />
      <Button
        title="Take a Quiz"
        onPress={() => navigation.navigate('Quiz')} // Ensure 'Quiz' is correctly registered in your stack navigator
      />
      <Button
        title="Coin Tossing"
        onPress={() => navigation.navigate('CoinTossing')} // Ensure 'CoinTossing' is correctly registered in your stack navigator
      />
      <Button
        title="SpinWheel"
        onPress={() => navigation.navigate('SpinWheel')} // Ensure 'CoinTossing' is correctly registered in your stack navigator
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default ActivityScreen;
