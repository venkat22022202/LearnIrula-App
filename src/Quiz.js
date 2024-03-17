import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import axios from "axios";
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
  const [translateToTamil, setTranslateToTamil] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
  }, [currentQuestion, data, translateToTamil]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer > 0 ? prevTimer - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const shuffleOptions = (options) => {
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  };

  const displayQuestionAndOptions = () => {
    const question = `Question ${currentQuestion}: What is in the image?`;
    setQuestionText(question);
    const currentOptions = data.slice(currentQuestion - 1, currentQuestion + 3).map(item => ({
      text: translateToTamil ? item.taWord : item.enWord,
      audioPath: item.audioPath
    }));
    setOptions(shuffleOptions(currentOptions));
    setImageUri(data[currentQuestion - 1]?.picturePath);
    setIsSubmitted(false);
    setSelectedOption(null);
  };

  const playSound = async (audioPath) => {
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioPath },
      { shouldPlay: true }
    );
    await sound.playAsync();
  };

  const handleOptionPress = (option) => {
    setSelectedOption(option);
    playSound(option.audioPath);
  };

  const handleSubmit = () => {
    if (!isSubmitted && selectedOption) {
      const correctAnswer = translateToTamil ? data[currentQuestion - 1].taWord : data[currentQuestion - 1].enWord;
      if (selectedOption.text === correctAnswer) {
        setPoints(points + 10);
      }

      setIsSubmitted(true); // Mark as submitted to prevent multiple submissions

      setTimeout(() => {
        if (currentQuestion < data.length) {
          setCurrentQuestion(currentQuestion + 1);
          setIsSubmitted(false); // Reset for the next question
          setSelectedOption(null); // Clear selection
        } else {
          console.log("Quiz completed. Final points:", points);
          // Optionally reset for a new game or navigate to a results page
        }
        setTimer(60);
      }, 500); // Delay to show selection
    }
  };

  const toggleLanguage = () => {
    setTranslateToTamil(!translateToTamil);
  };

  return (
    <View style={styles.container}>
      {/* Display points above the quiz content */}
      <Text style={styles.pointsText}>Points: {points}</Text>

      <Pressable onPress={toggleLanguage} style={styles.languageToggleButton}>
        <Text style={styles.languageToggleButtonText}>
          {translateToTamil ? "Translate to English" : "Translate to Tamil"}
        </Text>
      </Pressable>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <View style={styles.quizContainer}>
          <Text style={styles.quizHeader}>{`Question ${currentQuestion}/10`}</Text>
          <Text style={styles.timerText}>{`Time left: ${timer}s`}</Text>
          <Text style={styles.questionText}>{translateToTamil ? `கேள்வி ${currentQuestion}: படத்தில் என்ன உள்ளது?` : questionText}</Text>
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.questionImage} />
          </View>
          {options.map((option, index) => (
            <Pressable
              key={index}
              onPress={() => handleOptionPress(option)}
              style={[styles.optionButton, selectedOption === option ? styles.selectedOption : null]}
            >
              <Text style={styles.optionButtonText}>{option.text}</Text>
            </Pressable>
          ))}
          {!isSubmitted && (
            <Pressable onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50, // Adjusted for proper spacing
    backgroundColor: "#F0F8FF",
  },
  loadingText: {
    color: "#FF4500",
    fontSize: 20,
  },
  quizContainer: {
    marginTop: 20, // Added to give space between the toggle button and the quiz card
    width: '90%',
    padding: 20,
    backgroundColor: "#FFF0F5",
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
    color: "#6A5ACD",
  },
  timerText: {
    marginBottom: 20,
    color: "#DC143C",
    fontSize: 20,
  },
  questionText: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#2F4F4F",
  },
  optionButton: {
    backgroundColor: "#87CEEB",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  optionButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  pointsText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: "#32CD32",
  },
  questionImage: {
    width: '100%',
    height: 200, // Adjust height to maintain aspect ratio
    resizeMode: 'contain',
    borderRadius: 10,
  },
  imageContainer: {
    width: 300,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Added to separate from options
  },
  languageToggleButton: {
    position: 'absolute',
    top: 10, // Adjusted to place above the card
    right: 20,
    backgroundColor: '#6A5ACD',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  languageToggleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#32CD32", // Green for visibility
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  selectedOption: {
    backgroundColor: '#D3D3D3', // Grey color for selected option
  },
});

export default Quiz;
