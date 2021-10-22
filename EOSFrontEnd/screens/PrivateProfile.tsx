import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Dimensions, Image, ImageBackground, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native'

import { ProfileCard } from '../components/ProfileCard'
import { Icon } from 'react-native-elements';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { User } from '../interfaces/User';
import axios from 'axios';
import ServerConstants from '../constants/Server';
import Loading from '../components/Loading';

const WIDTH = Dimensions.get('window').width;

enum ModalType {
    description,
    contactInfo,
}

interface ContactInfo {
    name: string | undefined,
    phone: string | undefined,
    email: string | undefined
}

export function PrivateProfile() {

    const { user, setUser } =  React.useContext(AuthenticatedUserContext);
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ modalType, setModalType] = useState<ModalType>();
    const [ description, setDescription ] = useState(user?.description);
    const [ descriptionLength, setDescriptionLength ] = useState(0);
    const [ isLoading, setisLoading ] = useState(false);

    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');

    const [ contactInfo, setContactInfo ] = useState<ContactInfo>({
        name: user?.name,
        phone: user?.phone,
        email: user?.email
    });
    
    function validateEmail(email: string) {
        if (email) {
            const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            console.log(reg.test(email))
            return reg.test(email)
        }
    }

    async function fetchUser() {
        const res = await axios.get<any>(ServerConstants.local + 'auth', { params: { uid: user?.uid } });
        if (res.data){
            const data: any = res.data
            delete data._id
            if (setUser) setUser(data as User)
        } else {
            throw new Error('Error retrieving user after modifying description')
        }
    }

    async function editDescription(){
        try {
            let res = await axios.patch(ServerConstants.local + 'auth', { 
                uid: user?.uid,
                patch: { description: description }
            })
            if (res.status == 200) {
                await fetchUser()
            } else {
                throw new Error(`Error updating description (status ${res.status}): ${res.statusText}`)
            }
        } catch (e) {
            console.error('Edit description error: ', e)
        }
    }

    async function editContactInfo(){
        console.log('editContactInfo')
        try {
            let res = await axios.patch(ServerConstants.local + 'auth', {
                uid: user?.uid,
                patch: contactInfo
            })
            if (res.status == 200) {
                await fetchUser()
            } else {
                throw new Error(`Error updating contact info (status ${res.status}): ${res.statusText}`)
            }
        } catch (e) {
            console.error('Edit contact info error: ', e)
        }
    }

    function openModal(type: ModalType) {
        setModalType(type)
        setModalVisible(true);
    }

    function descriptionModal() {
        const MAX_LENGTH = 240;
        const originalDescription = user?.description;
        return (
            <View style={styles.modalView}>
                {isLoading ? Loading({}): null}

                <Text style={styles.modalText}>Edit Description</Text>
                
                <View style={{width: '100%'}}>
                    <TextInput 
                        value={description}
                        style={styles.description}
                        numberOfLines={8}
                        multiline={true}
                        maxLength={MAX_LENGTH}
                        onChangeText={(text: string) => {
                            setDescription(text)
                            setDescriptionLength(text.length)
                        }}/>
                    <Text style={styles.descriptionCounter}>{descriptionLength}/{MAX_LENGTH}</Text>
                </View>
                
                <View style={styles.modalButtonContainer}>
                    <TouchableHighlight
                        style={{...styles.openButton, backgroundColor: 'gray'}}
                        onPress={async () => {
                            setDescription(user?.description)
                            setModalVisible(!modalVisible)
                        }}>
                        <Text style={styles.textStyle}>Cancel</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={styles.openButton}
                        onPress={async () => {
                            if (description != originalDescription){
                                setisLoading(true)
                                await editDescription()
                                setisLoading(false)
                            }
                            setModalVisible(!modalVisible);
                        }
                    }>
                        <Text style={styles.textStyle}>Confirm</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }

    function contactInfoModal() {
        return (
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Contact info</Text>

                <View style={styles.inputView}>
                    <Text style={styles.inputLabel}>Name</Text>
                    <TextInput
                        style={styles.contactInfoInput}
                        autoCapitalize='none'
                        value={contactInfo.name}
                        onChangeText={(name) => {
                            setContactInfo({...contactInfo, ...{name: name}})
                            if (name.length != 0)
                                setNameError('')
                            else
                                setNameError('Please enter a name')
                        }}/>
                    {nameError.length != 0 ? <Text style={styles.errorText}>{nameError}</Text> : null}
                </View>
                
                <View style={styles.inputView}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                        style={styles.contactInfoInput}
                        autoCapitalize='none'
                        keyboardType='email-address'
                        textContentType='emailAddress'
                        value={contactInfo.email}
                        onChangeText={(email) => {
                            setContactInfo({...contactInfo, ...{email: email}})
                            if (email.length != 0)
                                setEmailError('')
                            else
                                setEmailError('Please enter an email')
                        }}/>
                </View>

                <View style={styles.inputView}>
                    <Text style={styles.inputLabel}>Phone #</Text>
                    <TextInput
                        style={styles.contactInfoInput}
                        autoCapitalize='none'
                        keyboardType='phone-pad'
                        textContentType='telephoneNumber'
                        value={contactInfo.phone}
                        onChangeText={(phone) => {
                            setContactInfo({...contactInfo, ...{phone: phone}})
                            if (phone.length != 0)
                                setPhoneError('')
                            else
                                setPhoneError('Please enter a phone number')
                        }}/>
                </View>

                <View style={styles.modalButtonContainer}>
                    <TouchableHighlight
                    style={{...styles.openButton, backgroundColor: 'gray'}}
                    onPress={() => {
                        setContactInfo({
                            name: user?.name,
                            phone: user?.phone,
                            email: user?.email
                        });
                        setNameError('')
                        setEmailError('')
                        setPhoneError('')
                        setModalVisible(!modalVisible)
                    }}>
                        <Text style={styles.textStyle}>Cancel</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                    style={styles.openButton}
                    onPress={async () => {

                        if (contactInfo.email && !validateEmail(contactInfo.email)) {
                            setEmailError('Enter a valid email')
                        }

                        const submitCond = nameError.length == 0 && phoneError.length == 0 && emailError.length == 0

                        if (submitCond) {
                            setisLoading(true)
                            await editContactInfo()
                            setisLoading(false)

                            setModalVisible(!modalVisible);
                        }
                    }}>
                        <Text style={styles.textStyle}>Confirm</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.container}>
                <ImageBackground style={{ flex: 1 }} source={require('../assets/images/bg.png')}>
                    <Modal
                    animationType='fade'
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false)
                    }}>
                        <View style={styles.centeredView}>
                            {modalType == ModalType.description ? descriptionModal() : contactInfoModal()}
                        </View>
                    </Modal>
                    <StatusBar style='light'/>
                    {/* ---- Avatar + ratings ---- */}
                    <View style={styles.avatar}>
                        <Image resizeMode='cover' style={styles.photo} source={require('../assets/images/avatar.webp')} />
                        <Text style={styles.username}>{user?.name}</Text>
                        <Text>⭐⭐⭐⭐⭐</Text>
                    </View>
                    {/* ---- Profile cards ---- */}
                    <ProfileCard icon='calendar-today' iconType='material' title='Joined Date' editable={ false }>
                        <Text style={{fontSize: 20,}}>{user?.joinedDate}</Text>
                    </ProfileCard>
                    
                    <ProfileCard icon='document-text-outline' iconType='ionicon' title='Description' callback={() => openModal(ModalType.description)}>
                        {/* Max 240 char */}
                        <Text style={{fontSize: 11}}>{user?.description}</Text>
                    </ProfileCard>
                    
                    <ProfileCard icon='document-text-outline' iconType='ionicon' title='Contact Information' callback={() => openModal(ModalType.contactInfo)}>
                        <View style={{alignItems: 'flex-start',}}>
                            <View style={styles.info}>
                                <Icon name='alternate-email' type='material' size={18} style={styles.infoIcon} />
                                <Text style={styles.infoText}>{user?.email}</Text>
                            </View>
                            <View style={styles.info}>
                                <Icon name='call' type='material' size={18} style={styles.infoIcon} />
                                <Text style={styles.infoText}>{user?.phone}</Text>
                            </View>
                        </View>
                    </ProfileCard>
                    
                    {/* Orders list */}
                    <View style={styles.list}>
                        <Text>List</Text>
                    </View>
                </ImageBackground>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    avatar: {
        marginTop: '20%',
        marginBottom: '3%',
        alignItems: 'center',
    },
    username: {
        color: 'white',
        fontSize: 24
    },
    photo: {
        width: WIDTH/2.5,
        height: WIDTH/2.5,
        borderRadius: WIDTH/5,
        borderColor: 'white',
        borderWidth: 2
    },
    list: {
        backgroundColor: 'violet',
        borderWidth: 1
    },
    info: {
        marginTop: 5,
        flexDirection: 'row',
    },
    infoIcon: {
        marginRight: 7
    },
    infoText: {
        fontSize: 12
    },
    centeredView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.57)',
      },
    modalView: {
        margin: 20,
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 15,
        paddingVertical: 25,
        paddingHorizontal: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        backgroundColor: '#04b388',
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginHorizontal: 10,
        width: '40%'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
    description: {
        textAlignVertical: 'top',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        borderColor: 'lightgrey',
        width: '100%',
    },
    descriptionCounter: {
        alignSelf: 'flex-end',
        marginVertical: 5,
        marginRight: 5,
        fontStyle: 'italic',
        fontSize: 11
    },
    inputView: {
        width: "85%",
        marginBottom: 10,
      },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#04b388',
    },
    contactInfoInput: {
        color: 'black',
        paddingLeft: 0,
        borderBottomWidth: 2,
        borderColor: 'black',
    },
    modalButtonContainer: {
        marginTop: 15,
        flexDirection: 'row'
    },
    errorText: {
        color: 'red',
        fontStyle: 'italic',
        fontSize: 10
    }
});