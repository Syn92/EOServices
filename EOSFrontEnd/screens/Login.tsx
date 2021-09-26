import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

import Firebase from '../config/firebase';

const auth = Firebase.auth();

export function Login({navigation}: {navigation: any}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const onLogin = async () => {
    try {
      if (email !== '' && password !== '') {
        await auth.signInWithEmailAndPassword(email, password);
      }
    } catch (error: any) {
      console.log(error)
      setLoginError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style='dark' />

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
        autoFocus={true}
        value={password}
        onChangeText={text => setPassword(text)}
        style={{
          width: '100%',
          fontSize: 14,
          marginBottom: 20,
          backgroundColor: "white"
        }}
      />

      {loginError ? <Text style={{color: 'darkred'}}>Error</Text> : null}

      <Button title="Login" onPress={onLogin}/>
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    alignSelf: 'center',
    paddingBottom: 24
  }
});
