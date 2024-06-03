import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import {
    Text,
} from "react-native-paper";

const OCR = () => {
    return (
        <>
            <Header title="Home" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text>OCR</Text>
                </View>
            </TouchableWithoutFeedback>
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
});