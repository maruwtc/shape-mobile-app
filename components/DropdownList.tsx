import React, { useState, useCallback } from 'react';
import { View, StatusBar, FlatList, TouchableOpacity, Text, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { TextInput } from 'react-native-paper';

interface DropdownListProps {
    data: string[];
    onSelect: (value: string) => void;
    label: string;
}

const DropdownList: React.FC<DropdownListProps> = ({ data, onSelect, label }) => {
    const [userinput, setUserinput] = useState('');
    const [show, setShow] = useState(false);

    const openPicker = useCallback(() => {
        Keyboard.dismiss();
        setShow(true);
    }, []);

    const closePicker = useCallback(() => {
        Keyboard.dismiss();
        setShow(false);
    }, []);

    const hidePicker = useCallback((item: string) => {
        setShow(false);
        setUserinput(item);
        onSelect(item);
    }, [onSelect]);

    const handleOutsidePress = useCallback(() => {
        if (show) {
            setShow(false);
        }
    }, [show]);

    return (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={{ top: StatusBar.currentHeight, zIndex: 99 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
                    <View style={{ width: '100%' }}>
                        <TextInput
                            label={label}
                            disabled
                            placeholder={show ? '' : 'e.g.: Dutch'}
                            value={userinput}
                            style={{ width: '100%' }}
                            onChangeText={(text) => setUserinput(text)}
                            right={<TextInput.Icon onPress={show ? closePicker : openPicker} icon={show ? "chevron-up" : "chevron-down"} size={20} />}
                        />
                        {show ? (
                            <View style={{ maxHeight: 200, overflow: 'scroll', position: 'absolute', elevation: 1, width: '100%', marginTop: 60 }}>
                                <FlatList
                                    style={{ backgroundColor: '#fff', width: '100%' }}
                                    data={data}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => hidePicker(item)}>
                                            <Text style={{ padding: 8 }}>
                                                {item}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={(item) => item}
                                />
                            </View>
                        ) : null}
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default DropdownList;
