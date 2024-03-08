import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

//imports
const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timer, setTimer] = useState(60); // in seconds
  const [options, setOptions] = useState([]);
  const [points, setPoints] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const fetchData = useCallback(() => {
    console.log("Fetching data from API...");
    axios
      .get("https://learnirula.azurewebsites.net/api/") //https://learnirula.azurewebsites.net/api/
      .then((response) => {
        console.log("API response received");
        const data = response.data;

        // Cache data using AsyncStorage
        AsyncStorage.setItem("data", JSON.stringify(data));

        // Shuffle data
        const shuffledData = data.sort(() => Math.random() - 0.5);

        // Update state
        setData(shuffledData);
        setFilteredData(data);
        setRefreshing(false);
        setLoading(false);
        console.log("Data successfully shuffled and set to state.");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setTimeout(fetchData, 10000);
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    // Call the fetchData function when the component mounts
    fetchData();
    console.log("Made API Call");
  }, [fetchData]);

  const questionNumber = currentQuestion; // Simplify by using questionNumber directly

  useEffect(() => {
    // Check if data is available before executing logic
    if (data.length > 0) {
      // Fetch questions and options logic goes here
      // For simplicity, let's assume questions and options are predefined
      displayQuestionAndOptions();
    }
  }, [currentQuestion, data]);

  const getOriginalOptions = () => {
    // Check if data array is not empty and has enough elements
    if (data && data.length >= currentQuestion + 3) {
      // Logic to get original options based on question number
      // For simplicity, returning a fixed set of options
      const item = data[currentQuestion - 1];
      const item2 = data[currentQuestion];
      const item3 = data[currentQuestion + 1];
      const item4 = data[currentQuestion + 2];

      // Check if items exist before accessing their properties
      const option1 = item.enWord;
      const option2 = item2.enWord;
      const option3 = item3.enWord;
      const option4 = item4.enWord;

      return [option1, option2, option3, option4];
    } else {
      // Handle the case where data is not available or doesn't have enough elements
      return ["", "", "", ""];
    }
  };

  const shuffleArray = (array) => {
    // Function to shuffle array elements
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  const getRandomizedOptions = () => {
    // Logic to get and randomize options based on question number
    const originalOptions = getOriginalOptions();
    return shuffleArray(originalOptions);
  };

  const displayQuestionAndOptions = () => {
    // waitUntilLoaded();
    // Display question and options for the current question
    const question = getQuestionText();
    const image = getImageUrl();

    setOptions(getRandomizedOptions());
    // Simplify by setting the question text and image directly
    setQuestionText(question);
    //setImageUrl(image);

    // Logics to display question and image
    console.log(questionNumber);
    //console.log(image);
  };

  const getQuestionText = () => {
    // Logic to get question text based on question number
    return `Question ${questionNumber}: What is in the image?`;
  };

  const getImageUrl = () => {
    const item = data[currentQuestion - 1];
    return item ? item.picturePath : "";
  };

  const handleOptionPress = (option) => {
    // Handle option press logic goes here
    // For simplicity, let's just set the selected option
    setSelectedOption(option);

    // Check if the selected option is correct and update points
    if (option === getCorrectAnswer()) {
      updatePoints(10);
    }

    // Load next question after selecting an option
    loadNextQuestion();
  };

  const getCorrectAnswer = () => {
    const item = data[questionNumber - 1];
    return item.enWord; // Replace with the correct answer logic
  };

  const updatePoints = (increment) => {
    // Function to update points
    setPoints(points + increment);
  };

  const loadNextQuestion = () => {
    // Load next question logic goes here
    // For simplicity, let's increment the currentQuestion for demonstration
    setCurrentQuestion(currentQuestion + 1);
  };

  const isQuizEnd = currentQuestion > 10;

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={{ color: "white" }}>Loading...</Text>
      ) : isQuizEnd ? (
        <View>
          <Text
            style={styles.endScreen}
          >{`THANK YOU, YOU SCORED: ${points}/100`}</Text>
        </View>
      ) : (
        <View>
          <View style={styles.header}>
            <Text>{`Question ${currentQuestion}/10`}</Text>
            <Text>{`Timer: ${timer}s`}</Text>
          </View>

          <Text style={styles.quizText}>QuizIrula</Text>

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{questionText}</Text>
            <Image
              source={{ uri: data[currentQuestion - 1]?.picturePath }}
              style={styles.image}
            />
          </View>

          {/* Pressable buttons for multiple-choice questions */}
          {options.map((option, index) => (
            <Pressable
              key={index}
              onPress={() => handleOptionPress(option)}
              style={styles.optionButton}
            >
              <Text style={{ fontSize: 20 }}>{option}</Text>
            </Pressable>
          ))}
          {/* Points screen */}
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsText}>Points: {points}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

//stylesheet after this....

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#284387",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quizText: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    marginVertical: 10,
  },
  questionContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    resizeMode: "contain",
    width: 250,
    height: 250,
  },
  optionButton: {
    padding: 5,
    marginVertical: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    alignItems: "center",
  },
  pointsContainer: {
    marginTop: 20,
    alignItems: "center",
  },

  pointsText: {
    fontSize: 23,
    fontWeight: "bold",
  },
  endScreen: {
    paddingTop: 140,
    textAlignVertical: "center",
    flex: 1,
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default Quiz;
