import React, { useRef, useState } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Header from '@/components/Header';
import { Appbar, IconButton, Button, Text, Card, TextInput, Divider, Modal } from 'react-native-paper';
import { AutoFocus } from 'expo-camera/build/legacy/Camera.types';

export default function App() {
    const [permission, requestPermission] = useCameraPermissions();
    const [showCamera, setShowCamera] = useState(false);
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const camera = useRef<CameraView | null>(null);
    const [lastPictureModal, setLastPictureModal] = useState(false);
    const showlastPictureModal = () => setLastPictureModal(true);
    const hidelastPictureModal = () => setLastPictureModal(false);

    if (!permission) {
        return <View />;
    }

    const takePicture = async () => {
        try {
            const options = { quality: 0.5, base64: true };
            const data = await (AutoFocus.on, camera.current?.takePictureAsync(options) ?? Promise.resolve());
            console.log(data ? data.uri : "No data");
            setPhotoUri(data ? data.uri : null);
            setShowCamera(false);
        } catch (error) {
            console.error(error);
        }
    };

    const uploadPicture = () => {
        console.log("Uploading picture");
    };

    const cameraView = () => {
        if (!permission.granted) {
            return (
                <>
                    <Card className='flex-1 justify-center items-center w-full h-full'>
                        <Text className='text-center'>We need your permission to show the camera</Text>
                        <Button onPress={requestPermission}>Allow Camera</Button>
                    </Card>
                </>
            );
        } else {
            return (
                <CameraView ref={camera} className="flex-1 w-full min-w-full">
                    <View className='flex-1 flex-row bg-transparent m-4'>
                        <TouchableOpacity onPress={takePicture} className='flex-1 self-end items-center'>
                            <IconButton mode='outlined' icon="moon-full" size={48} />
                        </TouchableOpacity>
                    </View>
                </CameraView>
            );
        }
    };

    const openCameraView = () => {
        setShowCamera(true);
    };

    if (showCamera) {
        return (
            <>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => { setShowCamera(false) }} />
                    <Appbar.Content title="Camera" />
                </Appbar.Header>
                {cameraView()}
            </>
        );
    }

    return (
        <>
            <Header title="OCR" />
            <Card className='flex-1 justify-center items-center w-full h-full'>
                <Card.Content className='justify-center items-center'>
                    <TextInput
                        mode="outlined"
                        label="Text in Image"
                        value=""
                        className="w-full min-h-[180px] max-h-[180px]"
                        editable={false}
                        multiline
                    />
                    <Divider className='w-full my-4 bg-gray-500' />
                    <TextInput
                        mode="outlined"
                        label="Translated Text"
                        value=""
                        className="w-full min-h-[180px] max-h-[180px]"
                        editable={false}
                        multiline
                    />
                </Card.Content>
                <Card.Actions className='justify-between items-center my-4'>
                    <Button onPress={uploadPicture}>Upload Picture</Button>
                    <Button onPress={openCameraView}>Open Camera</Button>
                </Card.Actions>
                <Text className='text-center'>{photoUri ? 'Image saved' : "No Text"}</Text>
                {photoUri && <Button onPress={showlastPictureModal}>Check Image</Button>}
                <Modal visible={lastPictureModal} onDismiss={hidelastPictureModal}
                    contentContainerStyle={{ backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 40, margin: 20, borderRadius: 10 }}
                >
                    <Image source={photoUri ? { uri: photoUri } : { uri: 'https://picsum.photos/700' }} className='w-full h-full' />
                    <Button onPress={hidelastPictureModal} className='mt-4'>Close</Button>
                </Modal>
            </Card>
        </>
    );
};