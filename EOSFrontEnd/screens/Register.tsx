import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { Button, ImageBackground, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { ScrollView } from 'react-native-gesture-handler';
import HorizontalSeparator from '../components/HorizontalSeparator';
import {Wallet} from '../components/Wallet'
import Firebase from '../config/firebase';
import { Login } from './Login';
import * as wallet from '../components/Wallet'
const auth = Firebase.auth();

export function Register({navigation}: {navigation: any}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [signupError, setSignupError] = useState('');

  async function handleSignup() {
    try {
      if (email !== '' && password !== '') {
        if (password == passwordConfirmation)
          await auth.createUserWithEmailAndPassword(email, password);
      }
    } catch (error: any) {
      setSignupError(error.message);
    }
  };

  auth.onAuthStateChanged(function(user: any) {
    if (user) {
      user.updateProfile({displayName: "NEW USER NAME"})
    }
});

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={{flex: 1}}>
        <ImageBackground  source={require('../assets/images/bg.png')} style={styles.container}>
          <StatusBar style='light' />

          
          {/* Email input */}
          <View style={styles.inputView}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={{color: 'white'}} 
              autoCapitalize='none'
              keyboardType='email-address'
              textContentType='emailAddress'
              value={email}
              onChangeText={text => setEmail(text)}
            />
          </View>

          {/* Password input */}
          <View style={styles.inputView}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={{color: 'white'}}
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={true}
              textContentType='password'
              value={password}
              onChangeText={text => setPassword(text)}
            />
          </View>

          <View style={styles.inputView}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={{color: 'white'}}          
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={true}
              textContentType='password'
              value={passwordConfirmation}
              onChangeText={text => setPasswordConfirmation(text)}
            />
          </View>

          <HorizontalSeparator text='EOS Wallet' fontSize={20} lineColor='#04b388' />
          
          {signupError ? <Text style={styles.errorText}>{signupError}</Text> : null}

          <TouchableOpacity style={styles.iconView} onPress={() => navigation.navigate('WalletLink')}>
            <Icon name='sync-alt' type='material' size={30} color='white' />
            <Text style={styles.iconText} >Link</Text>
          </TouchableOpacity>

          <Text style={styles.text}>Or</Text>

          <TouchableOpacity style={styles.iconView}>
            <Icon name='update' type='material' size={30} color='white' />
            <Text style={styles.iconText}>Create</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: Platform.OS == 'ios' ?  60 : 80,
    paddingTop: '35%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  inputView: {
    width: "70%",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderColor: 'white',
  },
  inputLabel: {
    fontSize: 16,
    color: '#04b388',
  },
  text: {
    fontSize: 20,
    color: '#fff',
    paddingVertical: 15,
    alignSelf: 'center'
  },
  errorText: {
    color: 'darkred',
    fontWeight: 'bold',
    marginBottom: 20
  },
  helpLinkText: {
    textAlign: 'center',
  },
  iconView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#04b388',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 50
  },
  iconText: {
    color: 'white',
    marginLeft: 10,
  },
  button: {
    height: 50,
    backgroundColor: '#04b388',
    width: "50%",
    borderRadius: 25,
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  buttonText: {
    color: 'white',
  },
});