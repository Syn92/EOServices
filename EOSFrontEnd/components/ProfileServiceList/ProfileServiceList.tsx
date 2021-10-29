import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ButtonGroup, Tab, TabView } from 'react-native-elements'
import { ServiceInfo } from '../../interfaces/Services'
import { getAddress } from '../../utils/Cadastre'
import Loading from '../Loading'
import { ProfileServiceCard } from './ProfileServiceCard'

interface Props {
    data: Array<Object>,
}

export function ProfileServiceList(props: Props) {

    const [ index, setIndex ] = useState(0)

    return (
        <View style={styles.container}>
            <ButtonGroup
                onPress={setIndex}
                selectedIndex={index}
                buttons={['Offers', 'Completed']}
                containerStyle={styles.buttonGroup}/>
            {
                props.data.map((elem: any) => {
                    const serviceInfo: ServiceInfo = {
                        category: elem.category,
                        title: elem.title,
                        owner: elem.ownerName,
                        price: elem.priceEOS,
                        position: getAddress(elem.cadastre)
                    }
                    return (<ProfileServiceCard serviceInfo={serviceInfo} key={serviceInfo.title}/>)
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '88%',
        marginBottom: 10, 
        alignSelf: 'center',
        padding: 5,
        
        borderRadius: 15,
        backgroundColor: 'white',
    },
    buttonGroup: {
        borderRadius: 20
    }
})