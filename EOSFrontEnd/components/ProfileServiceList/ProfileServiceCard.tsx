import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { AuthenticatedUserContext } from '../../navigation/AuthenticatedUserProvider';

interface Prop {
    icon: string,
    iconType: string,
    title: string,
    editable?: boolean,
    children: React.ReactNode,
    callback?: any
}

export function ProfileServiceCard(props: Prop) {
    
    const { user, setUser } =  React.useContext(AuthenticatedUserContext);

    return (
        <View style={styles.card}>
            <Icon name={props.icon} 
                  type={props.iconType} 
                  color='#04b388' 
                  style={styles.icon} />
            <View style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.title}>{props.title}</Text>
                    {props.editable ? 
                    <TouchableOpacity onPress={props.callback}>
                        <Icon style={styles.edit} name='edit' type='material' size={20} color='#04b388' />
                    </TouchableOpacity> : null}
                </View>
                <View style={styles.content}>
                    {props.children}
                </View>
            </View>
        </View>
    )
}

ProfileServiceCard.defaultProps = {editable: true}

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

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
    container: {
        flex: 1,
        marginBottom: 5,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        marginRight: 10,
        marginBottom: 10,
        overflow: 'hidden',
    },
    title: {
        fontSize: 18,
    },
    icon: {
        flex: 1,
        justifyContent: 'center',
        marginRight: 10,
    },
    edit: {
        marginLeft: 10
    }
})