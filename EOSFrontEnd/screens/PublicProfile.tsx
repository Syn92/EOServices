import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Button, Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { ProfileCard } from '../components/ProfileCard'
import { Icon } from 'react-native-elements';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { User } from '../interfaces/User';
import axios from 'axios';
import ServerConstants from '../constants/Server';
import { ProfileServiceList } from '../components/ProfileServiceList/ProfileServiceList';
import Firebase from '../config/firebase';

const WIDTH = Dimensions.get('window').width;
const auth = Firebase.auth()

export function PublicProfile({route, navigation}: any) {

    const { uid } = route.params;

    const { user, setUser } =  React.useContext(AuthenticatedUserContext);
    const [ publicUser, setPublicUser] = useState<User | null>(null);
    const [ description, setDescription ] = useState(user?.description);
    const [ services, setServices ] = useState([])

    React.useEffect(() => {
        console.log(publicUser)
        fetchPublicUser();
        fetchUserServices();
    }, []);

    async function fetchUserServices() {
        try {
            const res = await axios.get<any>(ServerConstants.local + 'post/list', { params: { owner: uid } });
            setServices(res.data);
        } catch (e) {
            console.error('Fetch User Services: ', e)
        }
    }

    async function handleLogout() {
        try {
          await auth.signOut()
        } catch (error: any) {
          console.log('logout')
          console.log(error)
        }
      }

    async function fetchPublicUser() {
        console.log(uid)
        const res = await axios.get<any>(ServerConstants.local + 'auth', { params: { uid: uid } });
        if (res.data){
            console.log(res.data)
            const data: any = res.data
            delete data._id
            setPublicUser(data)
        } else {
            throw new Error('Error retrieving user')
        }
    }

    function renderPage() {
        return (
            <View>
                <View style={styles.avatar}>
                    <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
                        <Icon name='logout' 
                            type='material'
                            color='#04b388'
                            size={37} />
                    </TouchableOpacity>
                    <Image resizeMode='cover' style={styles.photo} source={require('../assets/images/avatar.webp')} />
                    <Text style={styles.username}>{publicUser?.name}</Text>
                    <Text>⭐⭐⭐⭐⭐</Text>
                </View>

                {/* ---- Description ---- */}
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>{publicUser?.description}</Text>
                </View>

                {/* ---- Profile cards ---- */}
                <ProfileCard icon='calendar-today' iconType='material' title='Joined Date' editable={ false }>
                    <Text style={{fontSize: 20,}}>{publicUser?.joinedDate}</Text>
                </ProfileCard>

                <TouchableOpacity style={styles.button}>
                    <Text style={{fontSize: 18, color: 'white'}}>Send Message</Text>
                </TouchableOpacity>
                
                
                {/* Orders list */}
                <View style={styles.listContainer}>
                    <View style={styles.refresh}>
                        <TouchableOpacity style={{paddingHorizontal: '20%'}} activeOpacity={0.2} onPress={fetchUserServices}>
                            <Icon name='refresh' type='material' color='#04b388'/>
                        </TouchableOpacity>
                    </View>
                </View>
                <ProfileServiceList data={services}/>
            </View>
        )
    }
    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.container}>
                <ImageBackground style={{ flex: 1 }} source={require('../assets/images/bg.png')}>
                    <StatusBar style='light'/>
                    {/* ---- Avatar + ratings ---- */}
                    { !publicUser ? null : renderPage()}                    
                </ImageBackground>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        alignItems: 'center',
        marginTop: 10
    },
    refresh: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // paddingHorizontal: '20%',
        backgroundColor: 'white'
    },
    avatar: {
        marginTop: '10%',
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
    logoutIcon: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '90%',
    },
    descriptionContainer: {
        width: '88%',
        alignContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: '2%',
        paddingVertical: '3%',
        marginVertical: '3%',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'rgba(255, 255, 255, 0.3)'
    },
    description: {
        textAlign: 'center',
        color: 'white',
    },
    button: {
        alignSelf: 'center',
        alignContent: 'center',
        backgroundColor: '#04b388',
        width: "45%",
        borderRadius: 25,
        marginVertical: '5%',
        paddingVertical: '1.5%',
        alignItems: "center",
    },
});