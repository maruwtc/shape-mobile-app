import { View } from "@/components/Themed";
import Header from "@/components/Header";
import React, { useState, useEffect } from "react";
import { Keyboard, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { TextInput, Button, Card, Text } from "react-native-paper";
import { GetLanguagesList } from "@/api/deepl";
import DropdownList from "@/components/DropdownList";

const Home = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [languagesName, setLanguagesName] = useState([]);
  const [languagesCode, setLanguagesCode] = useState([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const languages = await GetLanguagesList();
        setLanguagesName(languages.map((language: { name: string }) => language.name));
        setLanguagesCode(languages.map((language: { code: string }) => language.code));
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };
    fetchLanguages();
  }, []);

  const handleTranslate = () => {
    // Mock translation logic; replace with actual translation API call
    setOutput(input.split("").reverse().join(""));
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <>
      <Header title="Home" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <TextInput
            mode="outlined"
            label="Enter Text"
            value={input}
            style={styles.input}
            onChangeText={setInput}
            multiline
            numberOfLines={4}
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
                handleTranslate();
                Keyboard.dismiss();
              }}
            >
              Translate
            </Button>
          </View>
          <DropdownList data={languagesName} />
          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                mode="outlined"
                label="Translated Text"
                value={output}
                style={styles.input}
                editable={false}
                multiline
              />
              <View style={styles.buttonContainer}>
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
                    handleTranslate();
                    Keyboard.dismiss();
                  }}
                >
                  Show Optimized
                </Button>
              </View>
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
    minHeight: 180
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
  },
  halfButton: {
    width: '48%',
  },
  card: {
    width: '100%',
  },
});
