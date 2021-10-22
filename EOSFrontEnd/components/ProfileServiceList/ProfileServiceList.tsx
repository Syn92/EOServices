import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ButtonGroup, Tab, TabView } from 'react-native-elements'
import { ProfileServiceCard } from './ProfileServiceCard'

export function ProfileServiceList() {

    const [ index, setIndex ] = useState(0)

    return (
        <View style={styles.container}>
            <ButtonGroup
                onPress={setIndex}
                selectedIndex={index}
                buttons={['Offers', 'Completed']}
                containerStyle={styles.buttonGroup}/>
            <ProfileServiceCard icon='calendar-today' iconType='material' title='Joined Date' editable={ false }>
                <Text>dfgdfg</Text>
            </ProfileServiceCard>
            <ProfileServiceCard icon='calendar-today' iconType='material' title='Joined Date' editable={ false }>
                <Text>dfgdfg</Text>
            </ProfileServiceCard>
            <ProfileServiceCard icon='calendar-today' iconType='material' title='Joined Date' editable={ false }>
                <Text>dfgdfg</Text>
            </ProfileServiceCard>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '88%',
        marginVertical: 10, 
        alignSelf: 'center',
        padding: 5,
        
        borderRadius: 15,
        backgroundColor: 'white',
    },
    buttonGroup: {
        borderRadius: 20
    }
})