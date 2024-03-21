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
    paddingTop: 20,
    backgroundColor: "#FAFAFA", // Lighter shade for a clean and airy look
  },
  loadingText: {
    color: "#007AFF", // Switch to a more engaging blue
    fontSize: 20,
    fontWeight: "500", // Medium weight for a balance between bold and regular
  },
  quizContainer: {
    marginTop: 20,
    width: '95%',
    padding: 20,
    backgroundColor: "#FFFFFF", // Keep it clean and simple with white
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Slightly less elevation for a subtle depth
  },
  quizHeader: {
    fontSize: 24,
    fontWeight: "700", // Bold for emphasis
    marginBottom: 15,
    color: "#333333", // Deep gray for strong visibility
  },
  timerText: {
    marginBottom: 20,
    color: "#FF6347", // Tomate for urgency
    fontSize: 18,
    fontWeight: "600",
  },
  questionText: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "500",
    color: "#4A4A4A", // Slightly softer than black for ease on the eyes
  },
  optionButton: {
    backgroundColor: "#F0F0F0", // Light gray for an understated look
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0", // Subtle border color for definition
  },
  optionButtonText: {
    color: "#1C1C1E", // Almost black for contrast
    fontSize: 16,
    fontWeight: "600", // Semi-bold for legibility
    textAlign: "center",
  },
  pointsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50", // Crisp green for positivity
  },
  questionImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 20,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  languageToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#007AFF', // Bright blue for a pop of color
    marginVertical: 10,
  },
  languageToggleButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#34C759", // A welcoming shade of green
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  selectedOption: {
    borderColor: '#007AFF', // Highlight selected option with the primary color
    backgroundColor: '#E3F2FD', // A very light blue to indicate selection
  },
  progressBar: {
    marginVertical: 15,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0', // A neutral background for contrast
    color: "#007AFF", // Use the primary color for the progress fill
  },
  scrollView: {
    width: '100%',
  },
  badgeContainer: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#FFFBEA", // A warm background for the badge
    borderColor: "#FFC107", // Golden border
    borderWidth: 1,
    marginBottom: 20,
  },
  badgeText: {
    textAlign: 'center',
    color: "#FFC107", // Golden text to match the badge theme
    fontWeight: '600',
  },

});

export default Quiz;
