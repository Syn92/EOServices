import React from 'react'
import { GestureResponderEvent, StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements/dist/buttons/Button';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
    title: string,
    step: number,
    stepMax: number,
}

export default function StepIndicator({title, step, stepMax}: Props) {
    let stepTab: any = []
    for (let i = 1; i <= stepMax; i++) {    
        stepTab.push(
        <View style={[i == step ? styles.activeStepIndicator : styles.stepIndicator, {width: 90/stepMax + '%'} ]} key={i}>
        </View>)
    }

    return ( <View style={styles.stepIndicContainer}>

            { stepTab }
    </View>
    )
}

const styles = StyleSheet.create({
    stepIndicContainer: {
        paddingVertical: 20,
        width: '80%',
        height: 6,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    stepIndicator: {
        backgroundColor: '#04B388',
        height: 3,
        marginHorizontal: 1,
    },
    activeStepIndicator: {
        backgroundColor: '#04B388',
        height: 5,
        marginHorizontal: 1,

    }
})