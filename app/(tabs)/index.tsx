import { View, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { Keyboard, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { GetLanguagesList, TranslateText } from "@/api/deepl";
import DropdownList from "@/components/DropdownList";
import Header from "@/components/Header";

const Home = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [languagesName, setLanguagesName] = useState<string[]>([]);
  const [languagesCode, setLanguagesCode] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const languages = await GetLanguagesList();
        setLanguagesName(languages.map((language: any) => language.name));
        setLanguagesCode(languages.map((language: any) => language.code));
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };
    fetchLanguages();
  }, []);

  const fetchTranslateResult = async () => {
    if (!input.trim() || !selectedLanguage) {
      Alert.alert("Error", "Please enter text and select a language.");
      return;
    }

    setIsLoading(true);
    try {
      const selectedIndex = languagesName.indexOf(selectedLanguage);
      if (selectedIndex !== -1) {
        const selectedLanguageCode = languagesCode[selectedIndex];
        const translatedText = await TranslateText(input, selectedLanguageCode);
        console.log("Input:", input, "Target Language:", selectedLanguage, "Result:", translatedText)
        setOutput(translatedText);
      } else {
        console.error("Selected language not found in the list.");
      }
    } catch (error) {
      console.error("Error fetching translation:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <>
      <Header title="Home" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                mode="outlined"
                label="Enter Text"
                value={input}
                style={styles.input}
                onChangeText={setInput}
                multiline
                numberOfLines={4}
              />
              <DropdownList
                label="Target Language"
                data={languagesName}
                onSelect={(item) => setSelectedLanguage(item)}
              />
              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  style={[styles.button, styles.halfButton]}
                  onPress={handleClear}
                >
                  Clear
                </Button>
                <Button
                  mode="contained"
                  style={[styles.button, styles.halfButton]}
                  onPress={() => {
                    fetchTranslateResult();
                    Keyboard.dismiss();
                  }}
                >
                  Translate
                </Button>
              </View>
              <TextInput
                mode="outlined"
                label="Translated Text"
                value={isLoading ? "Loading..." : output}
                style={styles.input}
                editable={false}
                multiline
              />
              {/* <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  style={[styles.button, styles.halfButton]}
                  onPress={handleClear}
                >
                  Show Original
                </Button>
                <Button
                  mode="contained"
                  style={[styles.button, styles.halfButton]}
                  onPress={() => {
                    Keyboard.dismiss();
                  }}
                >
                  Show Optimized
                </Button>
              </View> */}
            </Card.Content>
          </Card>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 16,
    minHeight: 180,
    maxHeight: 180,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 10,
  },
  halfButton: {
    width: '48%',
  },
  card: {
    width: '100%',
  },
  loader: {
    margin: 16,
  },
});
