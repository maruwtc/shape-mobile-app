import React, { useRef, useState } from 'react';
import { Alert, TouchableOpacity, View, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Header from '@/components/Header';
import { Appbar, IconButton, Button, Text, Card, TextInput, Divider, Modal } from 'react-native-paper';
import { AutoFocus } from 'expo-camera/build/legacy/Camera.types';
import DetectedLanguageBadge from '@/components/DetectedLanguageBadge';
import DropdownList from '@/components/DropdownList';
import { RetrieveLanguage, TranslateText } from '@/api/deepl';
import { UploadImage } from '@/api/firebase';
import { CreateImageToTextPrediction, GetImageToTextPredictionResult, CacnelImageToTextPrediction } from '@/api/replicate';
import * as ImagePicker from 'expo-image-picker';

const OCR = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [showCamera, setShowCamera] = useState(false);
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const camera = useRef<CameraView | null>(null);
    const [lastPictureModal, setLastPictureModal] = useState(false);
    const showlastPictureModal = () => setLastPictureModal(true);
    const hidelastPictureModal = () => setLastPictureModal(false);
    const [detectedLanguage, setDetectedLanguage] = useState<string>("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    // const [isLoading, setIsLoading] = useState(false);
    const [isOCRLoading, setIsOCRLoading] = useState(false);
    const [isTranslateLoading, setIsTranslateLoading] = useState(false);
    const { languagesName, languagesCode } = RetrieveLanguage({ onSelect: setSelectedLanguage });
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

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

    const OCR = async () => {
        if (!photoUri) {
            Alert.alert("Error", "No image to upload.");
            return;
        }
        const uploadDateTime = new Date().toISOString().replace(/[-:.]/g, '');
        const filename = `image_${uploadDateTime}.jpg`;
        try {
            setIsOCRLoading(true);
            const firebaseUrl = await UploadImage({ name: filename, uri: photoUri });
            console.log("Firebase URL:", firebaseUrl);
            if (!firebaseUrl) {
                console.error("Firebase URL is undefined.");
                return;
            }
            const { geturl, cancelurl } = await CreateImageToTextPrediction(firebaseUrl);
            console.log(geturl, cancelurl);
            let result;
            while (true) {
                result = await GetImageToTextPredictionResult(geturl);
                if (result.status === 'succeeded' || result.status === 'failed') {
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            if (result.status === "succeeded") {
                console.log("Prediction result:", result.output);
                if (result.output === null) {
                    setInput("No text detected.");
                    return;
                }
                setInput(result.output);
            } else {
                console.error("Prediction failed");
                await CacnelImageToTextPrediction(cancelurl);
            }
        } catch (error) {
            console.error("Error uploading image to Firebase Storage or fetching prediction:", error);
        } finally {
            setIsOCRLoading(false);
        }
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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });
        console.log(result);
        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
        }
    }

    const fetchTranslateResult = async () => {
        if (!input.trim() || !selectedLanguage) {
            Alert.alert("Error", "Please enter text and select a language.");
            return;
        }
        setIsTranslateLoading(true);
        try {
            const selectedIndex = languagesName.indexOf(selectedLanguage);
            if (selectedIndex !== -1) {
                const translatedText = await TranslateText(input, languagesCode[selectedIndex]);
                console.log("Translated text:", translatedText)
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
            setIsTranslateLoading(false);
        }
    };

    const handleClear = () => {
        setInput("");
        setOutput("");
        setPhotoUri(null);
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
            <View className='flex-1 items-center w-full h-full'>
                <DetectedLanguageBadge detectedLanguage={detectedLanguage} />
                <TextInput
                    mode="outlined"
                    label="Text in Image"
                    value={isOCRLoading ? "Loading..." : input}
                    className="w-full min-h-[180px] max-h-[180px]"
                    editable={false}
                    multiline
                />
                <DropdownList label="Target Language" data={languagesName} onSelect={setSelectedLanguage} />
                <TextInput
                    mode="outlined"
                    label="Translated Text"
                    value={isTranslateLoading ? "Loading..." : output}
                    className="w-full min-h-[180px] max-h-[180px]"
                    editable={false}
                    multiline
                />
                <View className='flex-row justify-around align-center w-full items-center mt-4'>
                    <Button mode="outlined" className='w-1/3' onPress={openCameraView}>Camera</Button>
                    <IconButton mode='contained' icon="line-scan" size={36} iconColor='white' onPress={OCR} />
                    <Button mode="outlined" className='w-1/3' onPress={pickImage}>Choose...</Button>
                </View>
                <Text className='text-center'>{photoUri ? 'Image saved' : null}</Text>
                <View className='flex-row justify-around my-4'>
                    {photoUri && <Button className='w-1/3' onPress={showlastPictureModal}>Check Image</Button>}
                    {photoUri && <Button className='w-1/3' onPress={fetchTranslateResult}>Translate</Button>}
                    {photoUri && <Button className='w-1/3' onPress={handleClear}>Clear</Button>}
                </View>
                <Modal visible={lastPictureModal} onDismiss={hidelastPictureModal}
                    contentContainerStyle={{ backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 40, margin: 20, borderRadius: 10 }}
                >
                    <Image source={photoUri ? { uri: photoUri } : { uri: 'https://picsum.photos/700' }} className='w-full h-full' />
                    <Button onPress={hidelastPictureModal} className='mt-4'>Close</Button>
                </Modal>
            </View >
        </>
    );
};

export default OCR;