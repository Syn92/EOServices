import React from 'react'
import { GestureResponderEvent, StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements/dist/buttons/Button';
import { TouchableOpacity } from 'react-native';

interface Props {
    title: string,
    icon?: string,
    onPress: any,
    styleContainer?: any,
    styleText?: any,
}

export default function ActionButtonSecondary({title, icon, onPress, styleText, styleContainer}: Props) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, styleContainer]}>
            <Text style={[styles.buttonText, styleText]}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: '#fff',
        elevation: 8,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    buttonText: {
        fontSize: 18,
        color: "#04B388",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    }
})