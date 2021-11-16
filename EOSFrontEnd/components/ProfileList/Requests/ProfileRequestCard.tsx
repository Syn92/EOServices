import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, Image, Modal, View, TouchableOpacity } from 'react-native'
import { RequestInfo, RequestIndex } from '../../../interfaces/Services';
import Server from '../../../constants/Server';
import { Icon } from 'react-native-elements';
import { Contract } from '../../../interfaces/Contracts';

interface Prop {
    requestInfo: RequestInfo,
    request: Contract,
    onUpdate: () => Promise<void>
}

export function ProfileRequestCard(props: Prop) {

    const navigation = useNavigation()

    const [ confirmationModalVisible, setConfirmationModalVisible] = useState(false)
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ isModalLoading, setIsModalLoading ] = useState(true)
    const [ cardType, setCardType ] = useState<RequestIndex>();

    useEffect(() => {
        setCardType(props.requestInfo.requestUser ? RequestIndex.selling : RequestIndex.buying)
    }, [])

    async function denyRequest() {
        try {
            let res = await axios.delete(Server.local + 'post', { params: { id: props.request._id } })
            props.onUpdate()
            // res.status == 200 --> request deleted
            // res.status == 204 --> didnt find match in db
            setModalVisible(false)
        } catch (e) {
            setModalVisible(false)
            console.error('Deny request: ', e)
        }
    }

    async function acceptRequest() {
        try {
            await axios.patch(Server.local + 'post/accept', { 
                serviceId: props.request.serviceId,
                contractId: props.request._id
            })
            props.onUpdate()
            setModalVisible(false)
        } catch (e) {
            setModalVisible(false)
            console.error('Accept request: ', e)
        }
    }

    async function onAcceptRequest() {
        if (props.requestInfo.isUnique)
            await acceptRequest()
        else
            setConfirmationModalVisible(true)
    }

    function confirmationModal() {
        return (
            <View style={modalStyles.confirmationModalView}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>Careful!</Text>
                <Icon name='info' type='material' color='gold' size={100}/>
                <Text style={{textAlign:'center', marginVertical: '3%'}}>
                    If you accept this request, all other requests for this service will be deleted.
                </Text>
                <View style={modalStyles.buttonContainer}>
                    <TouchableOpacity style={{...modalStyles.button, backgroundColor: 'grey'}} onPress={() => setConfirmationModalVisible(false)}>
                        <Text style={modalStyles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={modalStyles.button} onPress={acceptRequest}>
                        <Text style={modalStyles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    function incomingModal() {
        
        return (
            <View style={modalStyles.modalView}>
                <Modal
                    statusBarTranslucent={true}
                    animationType='slide'
                    transparent={true}
                    visible={confirmationModalVisible}
                    onRequestClose={() => {
                        setConfirmationModalVisible(false)
                    }}>
                    <View style={styles.centeredView}>
                            {confirmationModal()}
                    </View>
                </Modal>
                <View style={modalStyles.titleContainer}>
                    { props.requestInfo.thumbnail ? <View style={styles.imageContainer}>
                        <Image style={modalStyles.image} source={{uri: props.requestInfo.thumbnail, width: 50, height: 50}}/>
                    </View> : null }
                    <View style={modalStyles.titleContentContainer}>
                            <Text style={modalStyles.title}>{props.requestInfo.title}</Text>
                            <Text style={modalStyles.user}>From: {props.requestInfo.requestUser}</Text>
                    </View> 
                </View>
                {/* idk si ca reste */}
                {/* <View style={modalStyles.contentContainer}>
                    <Text style={modalStyles.contentTitle}>Request details: </Text>
                    <Text>{props.request.reqDescription}</Text>
                </View> */}

                <View style={modalStyles.buttonContainer}>
                    <TouchableOpacity style={modalStyles.button} onPress={() => {setModalVisible(false); navigation.navigate('PostDetails', props.request.serviceId)}}>
                        <Text style={modalStyles.buttonText}>Service</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={modalStyles.button} onPress={denyRequest}>
                        <Text style={modalStyles.buttonText}>Deny</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={modalStyles.button} onPress={onAcceptRequest}>
                        <Text style={modalStyles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    function outgoingModal() {
        return (
            <View style={modalStyles.modalView}>
                <View style={modalStyles.titleContainer}>
                    { props.requestInfo.thumbnail ? <View style={styles.imageContainer}>
                        <Image style={modalStyles.image} source={{uri: props.requestInfo.thumbnail, width: 50, height: 50}}/>
                    </View> : null }
                    <View style={modalStyles.titleContentContainer}>
                            <Text style={modalStyles.title}>{props.requestInfo.title}</Text>
                            <Text style={modalStyles.user}>Offered by: {props.requestInfo.serviceOwner}</Text>
                    </View> 
                </View>
                {/* same */}
                {/* <View style={modalStyles.contentContainer}>
                    <Text style={modalStyles.contentTitle}>Request details: </Text>
                    <Text>{props.request.reqDescription}</Text>
                </View> */}

                <View style={modalStyles.buttonContainer}>
                    <TouchableOpacity style={{...modalStyles.button, width: '90%'}} onPress={() => setModalVisible(false)}>
                        <Text style={modalStyles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <TouchableOpacity style={styles.card} onPress={() => setModalVisible(true)}>
            <Modal
                statusBarTranslucent={true}
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false)
                }}>
                <View style={styles.centeredView}>
                        {cardType == RequestIndex.selling ? incomingModal() : outgoingModal()}
                </View>
            </Modal>
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={{uri: props.requestInfo.thumbnail, width: 50, height: 50}}/>
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.row}>
                    <Text style={styles.textTitle}>Service Name:</Text>
                    <Text style={styles.textContent}>{props.requestInfo.title}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.textTitle}>{cardType == RequestIndex.selling ? 'Requested by: ' : 'Requested to: ' }</Text>
                    <Text style={styles.textContent}>{cardType == RequestIndex.selling ? props.requestInfo.requestUser: props.requestInfo.serviceOwner}</Text>
                </View>
            </View> 
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        marginVertical: 10, 
        width: '88%',
        padding: 5,
        alignContent: 'center',
        alignSelf: 'center',
        borderRadius: 15,
        backgroundColor: 'white',

        // shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
    centeredView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 22,
    },
    imageContainer: {
        paddingVertical: '3%',
        justifyContent: 'center',
    },
    image: {
        borderRadius: 25,
        marginHorizontal: 15,
    },
    contentContainer: {
        flex: 1,
        paddingVertical: '3%',
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center'
    },
    textTitle: {
        fontWeight: 'bold',
    },
    textContent: {
        marginLeft: '2%',
        fontSize: 12
    },
})

const modalStyles = StyleSheet.create({
    modalView: {
        margin: 20,
        width: '95%',
        // minHeight: '40%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: '2%',

        //shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 11,
        },
        shadowOpacity: 0.55,
        shadowRadius: 14.78,

        elevation: 22,
    },
    confirmationModalView: {
        margin: 20,
        width: '70%',
        // height: '30%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: '2%',
        alignItems: 'center',
        justifyContent: 'center',

        //shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 11,
        },
        shadowOpacity: 0.55,
        shadowRadius: 14.78,
        elevation: 22,

    },
    contentContainer: {
        marginTop: '3%',
        paddingHorizontal: '2%',
        paddingVertical: '3%',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 5
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    titleContainer: {
        flexDirection: 'row',
    },
    titleContentContainer: {
        marginVertical: '3%',
        marginLeft: '3%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    contentTitle: {
        alignSelf: 'flex-start',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: '2%',
        borderBottomWidth: 1,
    },
    user: {
        fontSize: 17
    },
    image: {
        marginHorizontal: 15,
    },
    button: {
        backgroundColor: '#04b388',
        borderRadius: 10,
        elevation: 2,
        paddingVertical: '3%',
        marginHorizontal: '3%',
        marginTop: '5%',
        marginBottom: '3%',
        width: '25%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    }
})