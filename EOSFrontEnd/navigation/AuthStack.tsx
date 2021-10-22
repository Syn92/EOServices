import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Login } from '../screens/Login'
import { Register } from '../screens/Register';
import { WalletLink} from "../screens/WebViewWalletLink"
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
      <Stack.Screen name='WalletLink' component={WalletLink}  options={{headerShown: false}}/>

    </Stack.Navigator>
  )
}

const loginOptions = {
  title: 'EOS Marketplace',
  headerStyle: {
    color: '#04b388'
  }
}