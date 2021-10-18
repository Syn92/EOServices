import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { Button, Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'

import { ProfileCard } from '../components/ProfileCard'
import { Icon } from 'react-native-elements';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { User } from '../interfaces/User';
import axios from 'axios';
import ServerConstants from '../constants/Server';

const WIDTH = Dimensions.get('window').width;

export function PrivateProfile() {

    const { user, setUser } =  React.useContext(AuthenticatedUserContext);

    function editDescription(){
        axios.patch(ServerConstants.local + 'auth', { 
            uid: user?.uid,
            patch: { description: "this is the default description" }
        }).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }

    function editContactInfo(){
        axios.patch(ServerConstants.local + 'auth', { 
            uid: user?.uid,
            patch: { phone: "phone", name: 'name' }
        }).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <ImageBackground style={{ flex: 1 }} source={require('../assets/images/bg.png')}>
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
                    
                    <ProfileCard icon='document-text-outline' iconType='ionicon' title='Description' callback={editDescription}>
                        {/* Max 240 char */}
                        <Text style={{fontSize: 11}}>{user?.description}</Text>
                    </ProfileCard>
                    
                    <ProfileCard icon='document-text-outline' iconType='ionicon' title='Contact Information' callback={editContactInfo}>
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
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
});