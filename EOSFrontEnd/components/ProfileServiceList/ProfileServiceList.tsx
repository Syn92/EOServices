import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ButtonGroup, Tab, TabView } from 'react-native-elements'
import { ServiceInfo } from '../../interfaces/Services'
import { getAddress } from '../../utils/Cadastre'
import Loading from '../Loading'
import { ProfileServiceCard } from './ProfileServiceCard'

interface ServiceData {
    open: Array<Object>,
    inProgress: Array<Object>,
    completed: Array<Object>,
}

interface RequestData {
    outgoing: Array<Object>,
    incoming: Array<Object>,
}

interface Props {
    data: ServiceData | RequestData,
}

enum ServiceIndex {
    open = 0,
    inProgress = 1,
    completed = 2
}

enum RequestIndex {
    incoming = 0,
    outgoing = 1,
}

function instanceOfServiceData(object: any): object is ServiceData {
    let res = 'open' in object && 'inProgress' in object && 'completed' in object
    return res
}

export function ProfileServiceList(props: Props) {

    const [ index, setIndex ] = useState(0);
    const [ displayedData, setDisplayedData ] = useState(instanceOfServiceData(props.data) ? props.data.open : props.data.incoming);

    function serviceOnPress(i: number) {
        setIndex(i)
        switch (i) {
            case ServiceIndex.open:
                setDisplayedData((props.data as ServiceData).open)
                break;

            case ServiceIndex.inProgress:
                setDisplayedData((props.data as ServiceData).inProgress)
                break;

            case ServiceIndex.completed:
                setDisplayedData((props.data as ServiceData).completed)
                break;
        
            default:
                setDisplayedData([])
                break;
        }
    }

    function requestOnPress(i: number) {
        setIndex(i)
        switch (i) {
            case  RequestIndex.incoming:
                setDisplayedData((props.data as RequestData).incoming)
                break;
            
            case RequestIndex.outgoing:
                setDisplayedData((props.data as RequestData).outgoing)
                break;

            default:
                setDisplayedData([])
                break;
        }
    }

    function serviceView() {
        return (
            <View style={styles.container}>
                <ButtonGroup
                    onPress={serviceOnPress}
                    selectedIndex={index}
                    buttons={['Open', 'In Progress', 'Completed']}
                    containerStyle={styles.buttonGroup}/>
                {
                    displayedData.map((elem: any) => {
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

    function requestView() {
        return (
            <View style={styles.container}>
                <ButtonGroup
                    onPress={requestOnPress}
                    selectedIndex={index}
                    buttons={['Incoming', 'Outgoing']}
                    containerStyle={styles.buttonGroup}/>
                {
                    displayedData.map((elem: any) => {

                        
                        return (
                            <View style={styles.card}>
                                {Object.keys(elem).map((key) => {
                                    return (
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={{fontWeight: 'bold'}}>{key}: </Text>
                                            <Text>{elem[key]}</Text>
                                        </View>
                                    )
                                })}
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    return (instanceOfServiceData(props.data) ? serviceView() : requestView())
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
    },
    card: {
        marginVertical: 10, 
        width: '88%',
        padding: 5,
        alignContent: 'center',
        alignSelf: 'center',
        
        borderRadius: 15,
        backgroundColor: 'white',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
})