import { View, Alert, Keyboard, TouchableWithoutFeedback } from "react-native";
import React, { useState, useEffect } from "react";
import { TextInput, Button, Card, Badge } from "react-native-paper";
import { GetLanguagesList, TranslateText } from "@/api/deepl";
import DropdownList from "@/components/DropdownList";
import Header from "@/components/Header";

const Home = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState<string>("");
  const [languagesName, setLanguagesName] = useState<string[]>([]);
  const [languagesCode, setLanguagesCode] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const languages = await GetLanguagesList();
        setLanguagesName(languages.map(({ name }: any) => name));
        setLanguagesCode(languages.map(({ code }: any) => code));
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    })();
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
        const translatedText = await TranslateText(input, languagesCode[selectedIndex]);
        if (translatedText) {
          setOutput(translatedText.translatedText);
          setDetectedLanguage(translatedText.detectedSourceLanguage);
        } else {
          console.error("Translated text is undefined.");
        }
      } else {
        console.error("Selected language not found in the list.");
      }
    } catch (error) {
      console.error("Error fetching translation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <>
      <Header title="Home" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Card className="flex-1 justify-center items-center w-full h-full">
          <Card.Content>
            <Badge className="text-inherit bg-transparent text-teal-500">{detectedLanguage ? `Detected Language: ${detectedLanguage}` : "Detected Language:"}</Badge>
            <TextInput mode="outlined" label="Enter Text" value={input} className="w-full min-h-[200px] max-h-[200px]" onChangeText={setInput} multiline numberOfLines={4} />
            <DropdownList label="Target Language" data={languagesName} onSelect={setSelectedLanguage} />
            <TextInput mode="outlined" label="Translated Text" value={isLoading ? "Loading..." : output} className="w-full min-h-[200px] max-h-[200px]" editable={false} multiline />
          </Card.Content>
          <Card.Actions className="flex-row justify-between items-center my-4">
            <Button mode="outlined" className="" onPress={handleClear}>Clear</Button>
            <Button mode="contained" className="" onPress={() => { fetchTranslateResult(); Keyboard.dismiss(); }}>Translate</Button>
          </Card.Actions>
        </Card>
      </TouchableWithoutFeedback >
    </>
  );
};

export default Home;
