import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Pressable,
  Text,
  Switch,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
// import SpinWheelSVG from "./Material/SpinwheelVector.svg";

//SpinWheel and animation

const SpinWheel = () => {
  //const spinValue = new Animated.Value(0);
  const spinValue = useRef(new Animated.Value(0)).current;
  console.log("executed#####");
  const numSections = 8; // Assuming 8 sections
  const rotations = 5;
  const SectionUsed = useRef([0, 0, 0, 0, 0, 0, 0, 0]).current;
  // const [isEnabled, setIsEnabled] = useState(false);
  const [word, setword] = useState(0);

  // const toggleSwitch = () => {
  //   setIsEnabled((previousState) => !previousState);
  //   //  setlanguage((previousState) => !previousState);
  // };
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const fetchData = useCallback(() => {
    console.log("Fetching data from API...");
    axios
      .get("https://learnirula.azurewebsites.net/api/") //https://learnirula.azurewebsites.net/api/
      .then((response) => {
        console.log("API response received:");
        const data = response.data;

        // Cache data using AsyncStorage
        AsyncStorage.setItem("data", JSON.stringify(data));

        // Shuffle data
        const shuffledData = data.sort(() => Math.random() - 0.5);

        // Update state
        setData(shuffledData);
        setFilteredData(data);
        setRefreshing(false);
        console.log("Data successfully shuffled and set to state.");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    // Call the fetchData function when the component mounts
    fetchData();
    console.log("Made API Call");
  }, [fetchData]);

  const playSound = useCallback(async () => {
    if (spinValue._value < 5) return;
    //if (lockk) return;
    if (!data || data.length === 0) {
      console.error("Invalid data array:", data);
      return;
    }

    const ff = Math.floor((spinValue._value - 5) * 8);
    const id2 = (8 - ff) % 8;

    console.log("AUDIO PLAYED INDEX: " + id2);
    const selectedItem = data[id2];
    console.log(" WORD : " + selectedItem.enWord);

    if (!selectedItem || !selectedItem.audioPath) {
      console.error(
        "Invalid audioPath:",
        selectedItem && selectedItem.audioPath
      );
      return;
    }

    const soundObject = new Audio.Sound();

    try {
      await soundObject.loadAsync({
        uri: selectedItem ? selectedItem.audioPath : "",
      });

      await soundObject.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);

      if (error.status === 404) {
        console.log("Blob not found. Refreshing the page...");
        // Refresh the page after a short delay (you can adjust the delay as needed)
        setTimeout(() => {
          window.location.reload(true);
        }, 2000);
      }
    }
  }, [data, spinValue]);

  const numImages = 8;
  const angle = 360 / numImages;
  const radius = 145;

  const PictureInfoBox = () => {
    const id1 = (8 - word) % 8;
    const selectedItem = data[id1];

    if (!selectedItem || !selectedItem.enWord) {
      // Handle the case when selectedItem or enWord is not defined
      return null;
    }
    const lol = selectedItem.enWord;

    return (
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>{"Landed on: " + lol}</Text>
      </View>
    );
  };

  //const number of Rotations = 5;
  const getRandomSection = (targetSection, SectionUsed) => {
    // If the section hasn't been selected, return the same value
    if (SectionUsed[targetSection] != 1) {
      SectionUsed[targetSection] = 1;
      return targetSection;
    } else {
      // Find the next available section
      let nextSection = (targetSection + 1) % numSections;
      if (SectionUsed[nextSection] == 0) {
        SectionUsed[nextSection] = 1;
        return nextSection;
      } else {
        let OneCount = SectionUsed.filter((item) => item === 1).length;
        if (OneCount == 8) {
          SectionUsed.fill(0);
          return targetSection;
        } else {
          const Unused = SectionUsed.indexOf(0);
          SectionUsed[Unused] = 1;
          return Unused;
        }
      }
    }
  };

  const ImageWheel = () => {
    const calculateRotation = (index) => {
      //Calculate the rotation of each image
      const degreesPerSection = 360 / numImages;
      return index * degreesPerSection;
    };

    const renderImages = useCallback(() => {
      //image rendering logic
      return (
        <View style={styles.container2}>
          <View style={styles.imageContent}>
            {data.slice(0, numImages).map((item, index) => {
              // Calculate the position of each image in a circle
              const angleInRadians = ((angle * index) / 180) * Math.PI;
              const positionX = radius * Math.cos(angleInRadians);
              const positionY = radius * Math.sin(angleInRadians);

              return (
                <View
                  key={index}
                  style={{
                    position: "absolute",
                    left: positionX - 37.5,
                    top: positionY - 37.5,
                    transform: [
                      {
                        rotate: `${calculateRotation(index)}deg`,
                      },
                    ],
                  }}
                >
                  <Image
                    source={{ uri: item.picturePath }}
                    style={{ width: 75, height: 75, resizeMode: "contain" }}
                  />
                </View>
              );
            })}
          </View>
        </View>
      );
    }, [data]);

    return renderImages();
  };

  const spinWheel = () => {
    spinValue.setValue(0);
    const targetSection = Math.floor(Math.random() * numSections); //between 0 and 7.

    const selectedSection = getRandomSection(targetSection, SectionUsed);

    console.log(
      " targetSection: " +
        targetSection +
        " landed on : " +
        (((8 - selectedSection) % 8) + 1) +
        " Array :  " +
        SectionUsed +
        " Selected Section : " +
        selectedSection +
        " Audio Number : " +
        selectedSection
    );

    Animated.timing(spinValue, {
      toValue: rotations + selectedSection / numSections,
      duration: 4000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      console.log("Animation stop SpinV: " + spinValue._value);
      setword(selectedSection);
    });

    console.log("Animation start SpinV: " + spinValue._value);
  };

  // ...

  return (
    <View style={styles.container}>
      {/* <View style={styles.Switch}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          changeValueImmediately={true}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        <Text>{isEnabled ? "Irula" : "English"}</Text>
      </View> */}

      {/* Parent container for ImageWheel and WheelSpin */}
      <Animated.View
        style={[
          styles.wheelContainer,
          {
            transform: [
              {
                rotate: spinValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          },
        ]}
      >
        {/* WheelSpin image */}
        <Image
          source={require("../Material/SpinWheel3.png")}
          style={styles.wheel}
        />

        {/* ImageWheel component */}
        <ImageWheel />
      </Animated.View>

      <Pressable
        onPress={() => {
          spinWheel();
        }}
        style={styles.spinButton}
      >
        <Text style={styles.spinButtonText}>SPIN</Text>
      </Pressable>

      {/* Spinwheel Arrow/Ratchet/Pointer */}
      <Image
        source={require("../Material/Ratchet1.png")}
        style={styles.ratchet}
      />

      {/* Visible sound button
      <AudioButton data={data}/> */}

      <Pressable
        onPress={useCallback(() => {
          playSound();
          // setAudioNumber(landedon);
        }, [playSound])}
        style={styles.Audiobutton}
      >
        {/* Add any content inside the Pressable if needed */}
      </Pressable>
      <PictureInfoBox data={data} word={word}></PictureInfoBox>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    //  top: 90,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#284387",
    paddingTop: 90,
  },
  container2: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 188,
  },
  wheelContainer: {
    //spinwheel animation in this container
    alignItems: "center",
    width: 376, // Set the width of the SpinWheel
    height: 376, // Set the height of the SpinWheel
  },
  wheel: {
    //spinwheel attributes
    alignItems: "center",
    position: "absolute",
    width: 376, // Adjust the width as needed
    height: 376, // Adjust the height as needed
    // resizeMode: "contain",
  },
  // Switch: {
  //   //flex: 1,
  //   padding: 20,
  //   left: 185,
  //   //alignItems: "right",
  //   //justifyContent: "right",
  // },
  spinButton: {
    width: 120, // Set a fixed width and height to make it a circle
    height: 120,
    justifyContent: "center", // Center the content vertically
    alignItems: "center", // Center the content horizontally
    backgroundColor: "blue",
    borderRadius: 60, // Set half of the width/height to make it a circle
    padding: 10,
    top: -248,
  },
  ratchet: {
    position: "relative",
    left: 185,
    top: -335,
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  spinButtonText: {
    fontSize: 25, // Adjust the font size as needed
    fontFamily: "Helvetica",
    fontStyle: "italic",
    color: "yellow",
  },
  imageWheel: {
    alignItems: "center",
    marginBottom: 90, // Adjust margin as needed
    marginLeft: 10, // Add left margin as needed
  },
  imageContent: {
    // flexDirection: "row",
    position: "relative",
  },
  Audiobutton: {
    position: "relative",
    right: -135,
    top: -398, //top 300 with switch
    width: 60,
    height: 80,
    backgroundColor: "transparent",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  infoBox: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 8,
    position: "absolute",
    bottom: 150,
    //left: 20,
    // zIndex: 1000,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SpinWheel;
