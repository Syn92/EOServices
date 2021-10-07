import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Login } from '../screens/Login'
import { Register } from '../screens/Register';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Login' component={Login}  options={{headerShown: false}}/>
      <Stack.Screen name='Register' component={Register} options={{
        headerTransparent: true,
        headerShadowVisible: false,
        headerTintColor: '#04b388'
        }}/>
    </Stack.Navigator>
  )
}

const loginOptions = {
  title: 'EOS Marketplace',
  headerStyle: {
    color: '#04b388'
  }
}