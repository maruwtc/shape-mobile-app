import React, { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import Header from '@/components/Header';
import { Alert, View } from 'react-native';
import { IconButton, Button, Card, TextInput } from "react-native-paper";
import { CreateSpeechToTextPrediction, GetSpeechToTextPredictionResult, CacnelSpeechToTextPrediction } from '@/api/replicate';
import { UploadAudio } from '@/api/firebase';
import DetectedLanguageBadge from '@/components/DetectedLanguageBadge';
import { RetrieveLanguage, TranslateText } from '@/api/deepl';
import DropdownList from '@/components/DropdownList';

const App = () => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [recordingUri, setRecordingUri] = useState<string | null>(null);
    const [transcription, setTranscription] = useState<string>("");
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [translation, setTranslation] = useState<string>("");
    const [detectedLanguage, setDetectedLanguage] = useState<string>("");
    const [selectedLanguage, setSelectedLanguage] = useState<string>("");
    // const [isLoading, setIsLoading] = useState(false);
    const [isSpeechToTextLoading, setIsSpeechToTextLoading] = useState(false);
    const [isTranslateLoading, setIsTranslateLoading] = useState(false);
    const { languagesName, languagesCode } = RetrieveLanguage({ onSelect: setSelectedLanguage });

    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const startRecording = async () => {
        try {
            if (permissionResponse && permissionResponse.status !== 'granted') {
                console.log('Requesting permission..');
                await requestPermission();
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        console.log('Stopping recording..');
        if (!recording) return;
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        const uri = recording.getURI();
        setRecordingUri(uri);
        setRecording(null);
        console.log('Recording stopped and stored at', uri);
    };

    const playLastRecording = async () => {
        if (recordingUri) {
            console.log('Loading Sound');
            const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
            setSound(sound);
            console.log('Playing Sound', recordingUri);
            await sound.playAsync();
        } else {
            Alert.alert("Error", "No recording available to play.");
            console.log('No recording available to play');
        }
    };

    const upLoadRecording = async () => {
        if (!recordingUri) {
            Alert.alert("Error", "No audio to upload.");
            return;
        }
        const uploadDateTime = new Date().toISOString().replace(/[-:.]/g, '');
        const filename = `recorded_audio_${uploadDateTime}.m4a`;
        try {
            setIsSpeechToTextLoading(true);
            const firebaseUrl = await UploadAudio({ name: filename, uri: recordingUri });
            console.log("Audio uploaded to Firebase Storage:", firebaseUrl);
            if (!firebaseUrl) {
                console.error("Error: Firebase URL is null or undefined.");
                return;
            }
            const { geturl, cancelurl } = await CreateSpeechToTextPrediction(firebaseUrl);
            console.log("Prediction created successfully: geturl:", geturl, "cancelurl:", cancelurl);
            let result;
            while (true) {
                result = await GetSpeechToTextPredictionResult(geturl);
                if (result.status === 'succeeded' || result.status === 'failed') {
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            if (result.status === 'succeeded') {
                console.log("Transcription result:", result.output.text);
                if (result.output === null) {
                    setTranscription("No text detected.");
                    return;
                }
                setTranscription(result.output.text);
            } else {
                console.error("Transcription failed");
                await CacnelSpeechToTextPrediction(cancelurl);
            }
        } catch (error) {
            console.error("Error uploading audio to Firebase Storage or fetching transcription:", error);
        } finally {
            setIsSpeechToTextLoading(false);
        }
    };

    const fetchTranslateResult = async () => {
        if (!transcription.trim() || !selectedLanguage) {
            Alert.alert("Error", "Please upload voice and select a language.");
            return;
        }
        setIsTranslateLoading(true);
        try {
            const selectedIndex = languagesName.indexOf(selectedLanguage);
            if (selectedIndex !== -1) {
                const translatedText = await TranslateText(transcription, languagesCode[selectedIndex]);
                if (translatedText) {
                    setTranslation(translatedText.translatedText);
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
            setIsTranslateLoading(false);
        }
    };


    const handleClear = () => {
        setTranscription("");
        setTranslation("");
    };

    return (
        <>
            <Header title="Speech To Text" />
            <View className="flex-1 items-center w-full h-full">
                <DetectedLanguageBadge detectedLanguage={detectedLanguage} />
                <TextInput
                    mode="outlined"
                    label="Original Text"
                    value={isSpeechToTextLoading ? "Loading..." : transcription}
                    className="w-full min-h-[180px] max-h-[180px]"
                    editable={false}
                    multiline
                />
                <DropdownList label="Target Language" data={languagesName} onSelect={setSelectedLanguage} />
                <TextInput
                    mode="outlined"
                    label="Translated Text"
                    value={isTranslateLoading ? "Loading..." : translation}
                    className="w-full min-h-[180px] max-h-[180px]"
                    editable={false}
                    multiline
                />
                <View className="flex-row justify-around align-center w-full items-center mt-4">
                    <Button mode="outlined" className="w-2/5" onPress={handleClear}>Clear</Button>
                    <Button mode="contained" className="w-2/5" onPress={upLoadRecording}>Transcribe</Button>
                </View>
                <View className="flex-row justify-around align-center w-full items-center">
                    <Button mode="outlined" className="w-1/3" onPress={playLastRecording}>Play</Button>
                    <IconButton mode='outlined' icon="moon-full" size={48} iconColor={recording ? 'red' : 'green'} onPress={recording ? stopRecording : startRecording} />
                    <Button mode="contained" className="w-1/3" onPress={fetchTranslateResult}>Translate</Button>
                </View>
            </View >
        </>
    );
};

export default App;
