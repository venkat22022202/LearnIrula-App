import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, Pressable, StyleSheet,ScrollView } from "react-native";
import axios from "axios";
import { Audio } from 'expo-av';
import * as Progress from 'react-native-progress'; // Import the progress bar component

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
  const [progress, setProgress] = useState(0); // New state variable for progress

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

  useEffect(() => {
    // Update progress when the current question changes
    setProgress(currentQuestion / data.length);
  }, [currentQuestion, data.length]);

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
        const newPoints = points + 10;
        setPoints(newPoints);
        // Check if points have reached 50 and badge has not been awarded yet
        if (newPoints >= 50 && !hasBeenAwardedBadge) {
          setHasBeenAwardedBadge(true);
        }
      }
      setIsSubmitted(true); // Mark as submitted to prevent multiple submissions
 // Mark as submitted to prevent multiple submissions

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
  
  const [hasBeenAwardedBadge, setHasBeenAwardedBadge] = useState(false);

  
  const toggleLanguage = () => {
    setTranslateToTamil(!translateToTamil);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.quizContainer}>
            {hasBeenAwardedBadge && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>🏆 Achievement Unlocked: 50 Points!</Text>
              </View>
            )}
            <View style={styles.header}>
              <Pressable onPress={toggleLanguage} style={styles.languageToggleButton}>
                <Text style={styles.languageToggleButtonText}>
                  {translateToTamil ? "Translate to English" : "Translate to Tamil"}
                </Text>
              </Pressable>
              <Text style={styles.pointsText}>Points: {points}</Text>
            </View>

            <Progress.Bar 
              progress={progress} 
              width={null} 
              style={styles.progressBar}
              color="#32CD32"
            />

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
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 30, // Reduced for a tighter look
    backgroundColor: "#f7f7f7", // A softer background color
  },
  loadingText: {
    color: "#FF4500",
    fontSize: 20,
  },
  quizContainer: {
    marginTop: 20,
    width: '95%', // Slightly wider for more space
    padding: 20,
    backgroundColor: "#ffffff", // Pure white for cleanliness
    borderRadius: 20, // More pronounced rounded corners
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  quizHeader: {
    fontSize: 22,
    fontWeight: "600", // Slightly less bold for a modern look
    marginBottom: 15,
    color: "#5A5A5A", // Softer color for the text
  },
  timerText: {
    marginBottom: 20,
    color: "#E53E3E", // A vibrant color for the timer to stand out
    fontSize: 18,
  },
  questionText: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "500", // Medium weight for readability
    color: "#333333", // Darker color for contrast
  },
  optionButton: {
    backgroundColor: "#81E6D9", // A refreshing teal for options
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2, // Slight elevation for depth
  },
  optionButtonText: {
    color: "#2D3748", // Dark gray for better readability
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  pointsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#38A169", // A green that's not too bright
  },
  questionImage: {
    width: '100%',
    height: 250, // Increased height for better focus
    resizeMode: 'contain',
    borderRadius: 15, // Rounded corners for the image
    marginBottom: 20,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  languageToggleButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#3182CE', // A soothing blue
    marginVertical: 10, // Added vertical margin
  },
  languageToggleButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#48BB78", // A lively green
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  selectedOption: {
    backgroundColor: '#CBD5E0', // A light gray to indicate selection
  },
  progressBar: {
    marginVertical: 15,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EDF2F7', // Light background for the progress bar
  },
  scrollView: {
    width: '100%',
  },
});

export default Quiz;
