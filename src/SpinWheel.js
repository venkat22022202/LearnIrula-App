import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, Image, Pressable, Dimensions } from "react-native";
import axios from "axios";
import { Audio } from "expo-av";

const windowWidth = Dimensions.get('window').width;
const wheelSize = 300; // Diameter of the wheel
const numImages = 8; // Total number of images to display around the wheel
const SpinWheel = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const [data, setData] = useState([]);
  const [rotationDegrees, setRotationDegrees] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data from API...");
        const response = await axios.get("https://learnirula.azurewebsites.net/api/");
        console.log("API response received");
        const shuffledData = response.data.sort(() => Math.random() - 0.5);
        setData(shuffledData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const playSound = async (audioUri) => {
    console.log("Playing sound for URI:", audioUri);
    const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
    await sound.playAsync();
  };

  const spinWheel = () => {
    const rotations = 5 + Math.floor(Math.random() * 5); // Spin the wheel 5 to 9 times
    const degreePerSection = 360 / numImages;
    const randomSection = Math.floor(Math.random() * numImages);
    const finalDegrees = 360 * rotations + randomSection * degreePerSection;
    setRotationDegrees(finalDegrees);

    Animated.timing(spinValue, {
      toValue: finalDegrees,
      duration: 4000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && data.length > 0) {
        // Adjust landedIndex calculation based on the final spin position
        const landedIndex = (rotations * numImages + randomSection) % data.length;
        const landedData = data[landedIndex];
        if (landedData && landedData.audioPath) {
          playSound(landedData.audioPath);
        }
      }
    });
  };

  // Calculate positions for images around the wheel
  const renderImages = () => {
    return data.slice(0, numImages).map((item, index) => {
      const angle = (index * 360 / numImages) * Math.PI / 180;
      const imageX = (wheelSize / 2) * Math.cos(angle) + (windowWidth / 2) - 20; // Adjust for image size
      const imageY = (wheelSize / 2) * Math.sin(angle) + (wheelSize / 2) - 20; // Adjust for image size
      return (
        <Image
          key={index}
          source={{ uri: item.picturePath }}
          style={{
            width: 40,
            height: 40,
            position: 'absolute',
            left: imageX,
            top: imageY,
            transform: [{ rotate: `${-rotationDegrees}deg` }], // Counter rotate the images to keep them upright
          }}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.wheelContainer}>
        <Animated.View
          style={{
            ...styles.wheel,
            transform: [{ rotate: spinValue.interpolate({ inputRange: [0, 360], outputRange: ["0deg", "-360deg"] }) }],
          }}
        >
          <Image
            source={require("../Material/SpinWheel3.png")}
            style={styles.wheelImage}
          />
          {renderImages()}
        </Animated.View>
      </View>
      <Pressable onPress={spinWheel} style={styles.spinButton}>
        <Text style={styles.spinButtonText}>SPIN</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  wheelContainer: {
    width: wheelSize,
    height: wheelSize,
    justifyContent: "center",
    alignItems: "center",
    position: 'relative',
  },
  wheel: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
  },
  wheelImage: {
    width: "100%",
    height: "100%",
  },
  spinButton: {
    marginTop: 20,
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: "#3498db",
    borderRadius: 5,
  },
  spinButtonText: {
    color: "#FFF",
    fontSize: 18,
  },
});

export default SpinWheel;
