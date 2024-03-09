import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Make sure you are importing useNavigation

const CoinTossing = () => {
    const navigation = useNavigation(); // Using useNavigation hook to get access to navigation prop
    const [flipping, setFlipping] = useState(false);
    const rotateAnim = useRef(new Animated.Value(0)).current; // Initial rotation

    const flipCoin = () => {
        setFlipping(true);
        rotateAnim.setValue(0); // Reset the animation value to 0
        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000, // Adjust duration to match the flip time
            useNativeDriver: true, // Use native driver for better performance
        }).start(() => {
            setFlipping(false);
            const result = Math.random() < 0.5 ? 'english' : 'irula';
            // If the coin lands on the "irula" side, navigate to the Quiz screen
            if (result === 'irula') {
                navigation.navigate('Quiz'); // Make sure 'Quiz' matches the name of your quiz screen in the navigator
            } else {
                Alert.alert("English Side", "Now choose one of the four options.", [{ text: "OK" }]);
            }
        });
    };

    // Interpolate rotation value for Y axis
    const rotateY = rotateAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['0deg', '180deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.coinContainer, { transform: [{ rotateY }] }]}>
                {/* Updated to use a more generic disc icon that could represent a coin */}
                <Ionicons name="disc" size={100} color="#FFD700" />
            </Animated.View>
            <TouchableOpacity onPress={flipCoin} style={styles.button}>
                <Text style={styles.buttonText}>Toss Coin</Text>
            </TouchableOpacity>
            {flipping && <Text style={styles.flippingText}>Flipping...</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black', // Ensuring good contrast
    },
    coinContainer: {
        marginBottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#007bff', // A vibrant blue for the button
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25, // Fully rounded corners
        elevation: 3, // Slight elevation for depth
        marginTop: 20, // Space between the button and the flipping text
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    flippingText: {
        color: '#333333',
        fontSize: 18,
        marginTop: 10,
    },
});

export default CoinTossing;
