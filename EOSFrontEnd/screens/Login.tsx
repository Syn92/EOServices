import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import * as Google from 'expo-google-app-auth';

import Constants from 'expo-constants';
import Firebase from '../config/firebase';

const auth = Firebase.auth();

export function Login({navigation}: {navigation: any}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  async function handleLogin() {
    try {
      if (email !== '' && password !== '') {
        await auth.signInWithEmailAndPassword(email, password);
      }
    } catch (error: any) {
      setLoginError(error.message);
    }
  };

  function onSignIn(googleUser: any) {
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    const unsubscribe = auth.onAuthStateChanged(auth, (firebaseUser: any) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        const credential = auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
        );
  
        // Sign in with credential from the Google user.
        auth.signInWithCredential(auth, credential).catch((error: any) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The credential that was used.
          const credential = auth.GoogleAuthProvider.credentialFromError(error);
          // ...
        });
      } else {
        console.log('User already signed-in Firebase.');
      }
    });
  }

  const isUserEqual = (googleUser:any, firebaseUser:any) => {
    if (firebaseUser) {
      const providerData = firebaseUser.providerData;
      for (let i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

  async function signInWithGoogleAsync() {

    try {
      const result = await Google.logInAsync({
        androidClientId: Constants.manifest?.extra?.andClient,
        iosClientId: Constants.manifest?.extra?.iosClient,
        scopes: ['profile', 'email'],
      });
      
      if (result.type === 'success') {
        onSignIn(result)
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log(e)
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

      <Button title="Login" onPress={handleLogin}/>
      <Button title="Login with google" onPress={signInWithGoogleAsync}/>

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
