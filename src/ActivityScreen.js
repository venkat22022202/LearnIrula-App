import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';

function ActivityScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activities</Text>
      
      <View style={styles.buttonsContainer}>
        <Button
          title="Check Speech"
          onPress={() => navigation.navigate('SpeechCheck')}
          buttonStyle={{ ...styles.button, backgroundColor: '#EF5350' }} // Reddish
          icon={<Icon name="mic" type="material" color="#ffffff" />}
          titleStyle={styles.buttonText}
        />

        <Button
          title="Take a Quiz"
          onPress={() => navigation.navigate('Quiz')}
          buttonStyle={{ ...styles.button, backgroundColor: '#5C6BC0' }} // Indigo
          icon={<Icon name="school" type="material" color="#ffffff" />}
          titleStyle={styles.buttonText}
        />

        <Button
          title="Coin Tossing"
          onPress={() => navigation.navigate('CoinTossing')}
          buttonStyle={{ ...styles.button, backgroundColor: '#66BB6A' }} // Green
          icon={<Icon name="casino" type="material" color="#ffffff" />}
          titleStyle={styles.buttonText}
        />

        <Button
          title="SpinWheel"
          onPress={() => navigation.navigate('SpinWheel')}
          buttonStyle={{ ...styles.button, backgroundColor: '#FFA726' }} // Orange
          icon={<Icon name="refresh" type="material" color="#ffffff" />}
          titleStyle={styles.buttonText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6E6FA', // Soft Lavender
  },
  title: {
    fontSize: 28,
    color: '#37474F', // Darker Slate Gray for stronger contrast
    marginBottom: 20,
    fontWeight: 'bold',
    letterSpacing: 1, // Slightly spaced out letters
  },
  buttonsContainer: {
    backgroundColor: '#FFFFFF', // Pure white for a clean, modern look
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    borderRadius: 20, // More pronounced rounded corners
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    minWidth: 260, // Slightly wider buttons
    elevation: 2, // Subtle elevation for depth
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0, // Removed border for a cleaner look
    backgroundColor: 'transparent', // Emphasizing the button color over borders
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold', // Stronger emphasis on button text
    marginLeft: 10,
    color: '#FFFFFF', // White text for clarity
  },
});

export default ActivityScreen;
