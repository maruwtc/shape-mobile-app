import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import Header from '@/components/Header';
import {
    Button
} from "react-native-paper";

export default function App() {
    const [sound, setSound] = useState();
    const [recording, setRecording] = useState();
    const [recordingUri, setRecordingUri] = useState(null);
    const [permissionResponse, requestPermission] = Audio.usePermissions();

    async function playSound() {
        if (recordingUri) {
            console.log('Loading Sound');
            const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
            setSound(sound);

            console.log('Playing Sound');
            await sound.playAsync();
        } else {
            console.log('No recording available to play');
        }
    }

    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    async function startRecording() {
        try {
            if (permissionResponse.status !== 'granted') {
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
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        const uri = recording.getURI();
        setRecordingUri(uri);
        setRecording(undefined);
        console.log('Recording stopped and stored at', uri);
    }

    return (
        <>
            <Header title="OCR" />
            <View style={styles.container}>
                <Button
                    style={styles.button}
                    onPress={recording ? stopRecording : startRecording}
                >{recording ? 'Stop Recording' : 'Start Recording'}</Button>
                <Button style={styles.button} onPress={playSound}>Play Last Recording</Button>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginBottom: 10,
    },
});