import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import {
    Text,
} from "react-native-paper";

const Speech = () => {
    return (
        <>
            <Header title="Home" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text>Speech</Text>
                </View>
            </TouchableWithoutFeedback>
        </>
    );
}

export default Speech;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});