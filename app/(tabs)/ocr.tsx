import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Header from '@/components/Header';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    Text,
    Button
} from "react-native-paper";

const OCR = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [photoUri, setPhotoUri] = React.useState(null);
    const cameraRef = React.useRef(null);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <>
                <Header title="OCR" />
                <View style={styles.container}>
                    <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                    <Button onPress={requestPermission} mode="contained" style={{ margin: 20 }}>Grant permission</Button>
                </View>
            </>
        );
    }

    const takePhoto = async () => {
        setPhotoUri(null);
        const camera = cameraRef.current;
        if (!camera) return;
        try {
            const data = await camera.takePictureAsync();
            setPhotoUri(data.uri);
            console.log('photo: ', photoUri);
        } catch (error) {
            console.log('error: ', error);
        }
    }

    return (
        <>
            <Header title="OCR" />
            <View style={styles.container}>
                <CameraView style={styles.camera} facing='back'>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={takePhoto}>
                            <Button
                                mode="contained"
                                onPress={takePhoto}
                                style={styles.cameraButton}
                            ><Icon name="camera" style={styles.icon} /></Button>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            </View>
        </>
    );
}

export default OCR;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 4,

    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    cameraButton: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        height: 65,
        width: 65,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        marginBottom: 20,
    },
    icon: {
        color: 'white',
        fontSize: 20,
    },
});