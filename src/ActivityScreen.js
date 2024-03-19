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
    elevation: 5, // Slightly increased elevation for a more pronounced shadow
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, // Add a border to make the button stand out
    borderColor: '#ddd', // Subtle border color
    backgroundColor: 'transparent', // Use a transparent background to highlight the border and shadow
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500', // Make text a bit bolder
    marginLeft: 10,
    color: '#2F4F4F', // Use a color that contrasts well with the button's background
  },
});

export default ActivityScreen;
