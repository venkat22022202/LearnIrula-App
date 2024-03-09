import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from 'expo-av';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timer, setTimer] = useState(60);
  const [options, setOptions] = useState([]);
  const [points, setPoints] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [imageUri, setImageUri] = useState("");

  const fetchData = useCallback(() => {
    console.log("Fetching data from API...");
    axios.get("https://learnirula.azurewebsites.net/api/")
      .then((response) => {
        const newData = response.data.sort(() => Math.random() - 0.5);
        setData(newData);
        setLoading(false);
        setImageUri(newData[0]?.picturePath);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (data.length > 0) {
      displayQuestionAndOptions();
    }
  }, [currentQuestion, data]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const displayQuestionAndOptions = () => {
    const question = `Question ${currentQuestion}: What is in the image?`;
    setQuestionText(question);
    setOptions(data.slice(currentQuestion - 1, currentQuestion + 3).map(item => ({ text: item.enWord, audioPath: item.audioPath })));
    setImageUri(data[currentQuestion - 1]?.picturePath);
  };

  const playSound = async (audioPath) => {
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioPath },
      { shouldPlay: true }
    );
    await sound.playAsync();
  };

  const handleOptionPress = (option) => {
    setSelectedOption(option.text);
    playSound(option.audioPath);

    if (option.text === data[currentQuestion - 1].enWord) {
      setPoints(points + 10);
    }

    if (currentQuestion < data.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimer(60); // Reset timer for next question
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <View style={styles.quizContainer}>
          <Text style={styles.quizHeader}>{`Question ${currentQuestion}/10`}</Text>
          <Text style={styles.timerText}>{`Time left: ${timer}s`}</Text>
          <Text style={styles.questionText}>{questionText}</Text>
          <Image source={{ uri: imageUri }} style={styles.questionImage} />
          {options.map((option, index) => (
            <Pressable
              key={index}
              onPress={() => handleOptionPress(option)}
              style={styles.optionButton}
            >
              <Text style={styles.optionButtonText}>{option.text}</Text>
            </Pressable>
          ))}
          <Text style={styles.pointsText}>Points: {points}</Text>
        </View>
      )}
    </View>
  );
};

// Updated styles for a more colorful and attractive UI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F8FF", // Light sky blue background
  },
  loadingText: {
    color: "#FF4500", // Orangered color for loading text
    fontSize: 20,
  },
  quizContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: "#FFF0F5", // Lavender blush background for quiz container
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quizHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#6A5ACD", // Slate blue color
  },
  timerText: {
    marginBottom: 20,
    color: "#DC143C", // Crimson color for timer
    fontSize: 20,
  },
  questionText: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#2F4F4F", // Dark slate gray color
  },
  optionButton: {
    backgroundColor: "#87CEEB", // Sky blue color for option buttons
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  optionButtonText: {
    color: "#FFFFFF", // White color text
    fontSize: 18,
    fontWeight: "bold",
  },
  pointsText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: "#32CD32", // Lime green color
  },
  questionImage: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    borderRadius: 10,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default Quiz;
