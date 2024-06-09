import React, { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import Header from '@/components/Header';
import { IconButton, Button, Card, Divider, TextInput } from "react-native-paper";
import { CreatePrediction, GetPredictionResult, CacnelPrediction } from '@/api/replicate';
import { UploadAudio } from '@/api/firebase';

const App = () => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [recordingUri, setRecordingUri] = useState<string | null>(null);
    const [transcription, setTranscription] = useState<string>("");
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [translation, setTranslation] = useState<string>("");

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
            console.log('No recording available to play');
        }
    };

    const upLoadRecording = async () => {
        if (!recordingUri) return;
        const uploadDateTime = new Date().toISOString().replace(/[-:.]/g, '');
        const filename = `recorded_audio_${uploadDateTime}.m4a`;
        try {
            const firebaseUrl = await UploadAudio({ name: filename, uri: recordingUri });
            console.log("Audio uploaded to Firebase Storage:", firebaseUrl);
            if (!firebaseUrl) {
                console.error("Error: Firebase URL is null or undefined.");
                return;
            }
            const { geturl, cancelurl } = await CreatePrediction(firebaseUrl);
            console.log("Prediction created successfully: geturl:", geturl, "cancelurl:", cancelurl);
            let result;
            while (true) {
                result = await GetPredictionResult(geturl);
                if (result.status === 'succeeded' || result.status === 'failed') {
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            if (result.status === 'succeeded') {
                console.log("Transcription result:", result.output.text);
                setTranscription(result.output.text);
            } else {
                console.error("Transcription failed");
                await CacnelPrediction(cancelurl);
            }
        } catch (error) {
            console.error("Error uploading audio to Firebase Storage or fetching transcription:", error);
        }
    };

    return (
        <>
            <Header title="Speech To Text" />
            <Card className="flex-1 justify-center items-center w-full h-full">
                <Card.Content className="justify-center items-center">
                    <TextInput
                        mode="outlined"
                        label="Original Text"
                        value={transcription}
                        className="w-full min-h-[180px] max-h-[180px]"
                        editable={false}
                        multiline
                    />
                    <Divider className='w-full my-4 bg-gray-500' />
                    <TextInput
                        mode="outlined"
                        label="Translated Text"
                        value={translation}
                        className="w-full min-h-[180px] max-h-[180px]"
                        editable={false}
                        multiline
                    />
                    <IconButton mode='outlined' icon="moon-full" size={48} iconColor={recording ? 'red' : 'green'} onPress={recording ? stopRecording : startRecording} className='mt-4' />
                </Card.Content>
                <Card.Actions className='justify-between items-center'>
                    <Button onPress={playLastRecording}>Play Last Recording</Button>
                    <Button onPress={upLoadRecording}>Upload & Transcribe</Button>
                </Card.Actions>
            </Card>
        </>
    );
};

export default App;
