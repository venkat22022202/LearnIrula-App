import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';

function ActivityScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activities</Text>
      
      {/* Container for the buttons with a specific style for colorfulness */}
      <View style={styles.buttonsContainer}>
        <Button
          title="Check Speech"
          onPress={() => navigation.navigate('SpeechCheck')}
          buttonStyle={{ ...styles.button, backgroundColor: '#FF6347' }} // Tomato
          icon={<Icon name="mic" type="material" color="#ffffff" />}
          titleStyle={styles.buttonText}
        />

        <Button
          title="Take a Quiz"
          onPress={() => navigation.navigate('Quiz')}
          buttonStyle={{ ...styles.button, backgroundColor: '#4682B4' }} // Steel Blue
          icon={<Icon name="school" type="material" color="#ffffff" />}
          titleStyle={styles.buttonText}
        />

        <Button
          title="Coin Tossing"
          onPress={() => navigation.navigate('CoinTossing')}
          buttonStyle={{ ...styles.button, backgroundColor: '#32CD32' }} // Lime Green
          icon={<Icon name="casino" type="material" color="#ffffff" />}
          titleStyle={styles.buttonText}
        />

        <Button
          title="SpinWheel"
          onPress={() => navigation.navigate('SpinWheel')}
          buttonStyle={{ ...styles.button, backgroundColor: '#FFA07A' }} // Light Salmon
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
    backgroundColor: '#E6E6FA', // Lavender background
  },
  title: {
    fontSize: 26,
    color: '#2F4F4F', // Dark Slate Gray for the title
    marginBottom: 20, // Adjusted to reduce space above the button container
    fontWeight: 'bold',
  },
  buttonsContainer: {
    // Style for the buttons' container to make it colorful
    backgroundColor: '#F0F8FF', // Alice Blue for a slight contrast with lavender
    borderRadius: 20, // Rounded corners
    padding: 20, // Padding inside the container
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,
    minWidth: 250,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    marginLeft: 10,
  },
});

export default ActivityScreen;
