import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'

import { ProfileCard } from '../components/ProfileCard'
import { Icon } from 'react-native-elements';

const WIDTH = Dimensions.get('window').width;

export function PrivateProfile() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <ImageBackground style={{ flex: 1 }} source={require('../assets/images/bg.png')}>
                    <StatusBar style='light'/>
                    {/* ---- Avatar + ratings ---- */}
                    <View style={styles.avatar}>
                        <Image resizeMode='cover' style={styles.photo} source={require('../assets/images/avatar.webp')} />
                        <Text style={styles.username}>Alfred</Text>
                        <Text>⭐⭐⭐⭐⭐</Text>
                    </View>

                    {/* ---- Profile cards ---- */}
                    <ProfileCard icon='calendar-today' iconType='material' title='Joined Date'>
                        <Text style={{fontSize: 20,}}>1st January 2025</Text>
                    </ProfileCard>
                    
                    <ProfileCard icon='document-text-outline' iconType='ionicon' title='Description'>
                        {/* Max 240 char */}
                        <Text style={{fontSize: 11}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce imperdiet libero ac dolor dictum feugiat. Maecenas porta posuere elit, id lobortis sem dignissim sit amet. Suspendisse congue enim ut augue egestas, eu viverra felis scelerisque</Text>
                    </ProfileCard>
                    
                    <ProfileCard icon='document-text-outline' iconType='ionicon' title='Contact Information'>
                        <View style={{alignItems: 'flex-start',}}>
                            <View style={styles.info}>
                                <Icon name='alternate-email' type='material' size={18} style={styles.infoIcon} />
                                <Text style={styles.infoText}>thisismymail@mail.com</Text>
                            </View>
                            <View style={styles.info}>
                                <Icon name='person' type='material' size={18} style={styles.infoIcon} />
                                <Text style={styles.infoText}>Alfred</Text>
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