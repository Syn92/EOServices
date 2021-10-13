import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

interface Props {
    isSmall?: boolean,
    color?: string,
    backgroundColor?: string
}

export default function Loading({isSmall=false, color='#D66C44', backgroundColor='#000000b9'}: Props) {
    return (
        <View style={{...styles.loading, backgroundColor: backgroundColor}}>
          <ActivityIndicator size={isSmall ? 'small' : 'large'} color={color} />
        </View>
    )
}

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,    
        zIndex: 100
    }
});