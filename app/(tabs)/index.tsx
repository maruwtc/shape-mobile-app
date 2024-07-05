import { Alert, Keyboard, TouchableWithoutFeedback } from "react-native";
import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { RetrieveLanguage, TranslateText } from "@/api/deepl";
import DropdownList from "@/components/DropdownList";
import Header from "@/components/Header";
import DetectedLanguageBadge from "@/components/DetectedLanguageBadge";

const Home = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { languagesName, languagesCode } = RetrieveLanguage({ onSelect: setSelectedLanguage });

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
        <View className="flex-1 items-center w-full h-full p-4">
          <DetectedLanguageBadge detectedLanguage={detectedLanguage} />
          <TextInput mode="outlined" label="Enter Text" value={input} className="w-full min-h-[180px] max-h-[180px]" onChangeText={setInput} multiline numberOfLines={4} />
          <DropdownList label="Target Language" data={languagesName} onSelect={setSelectedLanguage} />
          <TextInput mode="outlined" label="Translated Text" value={isLoading ? "Loading..." : output} className="w-full min-h-[180px] max-h-[180px]" editable={false} multiline />
          <View className='flex-row justify-around w-full my-4'>
            <Button mode="outlined" className="w-2/5" onPress={handleClear}>Clear</Button>
            <Button mode="contained" className="w-2/5" onPress={() => { fetchTranslateResult(); Keyboard.dismiss(); }}>Translate</Button>
          </View>
        </View>
      </TouchableWithoutFeedback >
    </>
  );
};

export default Home;
