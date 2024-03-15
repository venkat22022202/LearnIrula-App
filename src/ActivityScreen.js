import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';

function ActivityScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activities</Text>
      
      <Button
        title="Check Speech"
        onPress={() => navigation.navigate('SpeechCheck')}
        buttonStyle={styles.button}
        icon={<Icon name="mic" type="material" color="#ffffff" />}
      />
      
      <Button
        title="Take a Quiz"
        onPress={() => navigation.navigate('Quiz')}
        buttonStyle={styles.button}
        icon={<Icon name="school" type="material" color="#ffffff" />}
      />
      
      <Button
        title="Coin Tossing"
        onPress={() => navigation.navigate('CoinTossing')}
        buttonStyle={styles.button}
        icon={<Icon name="casino" type="material" color="#ffffff" />}
      />

      <Button
        title="SpinWheel"
        onPress={() => navigation.navigate('SpinWheel')}
        buttonStyle={styles.button}
        icon={<Icon name="refresh" type="material" color="#ffffff" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Light grey background
  },
  title: {
    fontSize: 24,
    color: '#333',
    marginBottom: 40,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007bff', // Bootstrap primary color
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    minWidth: 200,
    justifyContent: 'flex-start', // Align icon and text to the left
    iconRight: true, // Place icon to the right of text
  },
});

export default ActivityScreen;
