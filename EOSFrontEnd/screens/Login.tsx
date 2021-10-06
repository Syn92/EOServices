import React from 'react';
import { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Button, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase/app';

import Constants from 'expo-constants';
import Firebase from '../config/firebase';

const facebookAppId: Facebook.FacebookOptions = {};

export function Login({navigation}: {navigation: any}) {

  const [isLoading, setLoadingStatus] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  function renderLoading() {
    if(isLoading) {
      return (
        <View>
          <ActivityIndicator size='large' color='#0000ff' />
        </View>
      )
    }
  }

  async function signInWithEmail() {
    try {
      if (email !== '' && password !== '') {
        await Firebase.auth.signInWithEmailAndPassword(email, password);
      }
    } catch (error: any) {
      setLoginError(error.message);
    }
  };

  async function signInWithFacebook() {
    try {
      await Facebook.initializeAsync({appId: Constants.manifest?.extra?.fbAppId})
      const result = await Facebook.logInWithReadPermissionsAsync({permissions: ['public_profile']})

      if (result.type == 'success') {
        const credential = firebase.auth.FacebookAuthProvider.credential(result.token)

        await Firebase.auth().signInWithCredential(credential).then((res: any) => { 
          //TODO: isNewUser ? add to DB : nothing
          
          setLoadingStatus(false);
        })
      }

    } catch(e) {
      console.log(e);

      return { error: true };
    }
  }

  async function signInWithGoogle() {
    try {
      const result = await Google.logInAsync({
        androidClientId: Constants.manifest?.extra?.andClient,
        iosClientId: Constants.manifest?.extra?.iosClient,
        scopes: ['profile', 'email'],
      });
      
      if (result.type === 'success') {
        setLoadingStatus(true);
        const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken);
        await Firebase.auth().signInWithCredential(credential).then((res: any) => { 
          //TODO: isNewUser ? add to DB : nothing
          
          setLoadingStatus(false);
        })
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log(e)

      setLoadingStatus(false);
      return { error: true };
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOGIN</Text>

      {/*Email input */}
      <TextInput
        placeholder='Enter email'
        placeholderTextColor='black'
        autoCapitalize='none'
        keyboardType='email-address'
        textContentType='emailAddress'
        autoFocus={true}
        value={email}
        onChangeText={text => setEmail(text)}
        style={{
          width: '100%',
          fontSize: 14,
          marginBottom: 20,
          backgroundColor: "white"
        }}
      />

      {/* Password input*/}
      <TextInput
        placeholder='Enter password'
        placeholderTextColor='black'
        autoCapitalize='none'
        autoCorrect={false}
        secureTextEntry={true}
        textContentType='password'
        value={password}
        onChangeText={text => setPassword(text)}
        style={{
          width: '100%',
          fontSize: 14,
          marginBottom: 20,
          backgroundColor: "white"
        }}
      />

      {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

      {renderLoading()}

      <Button title="Login" onPress={signInWithEmail}/>
      <Button title="Login with google" onPress={signInWithGoogle}/>
      <Button title="Login with facebook" onPress={signInWithFacebook}/>

      <View style={styles.helpContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>
            Dont have an account? Register now!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gainsboro',
    paddingTop: 50,
    paddingHorizontal: 12
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'center',
    paddingBottom: 24
  },
  errorText: {
    color: 'darkred',
    fontWeight: 'bold',
    marginBottom: 20
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  }
});
