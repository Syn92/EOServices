import React from 'react';
import { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image
} from 'react-native';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase/app';
import { SocialIcon } from 'react-native-elements'

import Constants from 'expo-constants';
import Firebase from '../config/firebase';
import { ScrollView } from 'react-native-gesture-handler';

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
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            {/* EOS Logo */}
            <Image style={styles.image} source={require('../assets/images/eos.png')}/>

            {/* Email input */}
            <View style={styles.inputView}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
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
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={true}
                textContentType='password'
                value={password}
                onChangeText={text => setPassword(text)}
              />
            </View>

            {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}
            {renderLoading()}
            
            <TouchableOpacity style={{...styles.button, ...styles.mailButton}} onPress={signInWithEmail}>
              <Text style={{...styles.text, fontSize: 20, fontWeight: 'bold'}}>LOGIN</Text>
            </TouchableOpacity>

            <View style={{flexDirection: 'row', marginVertical: '5%'}}>
              <View style={styles.horizontalLine}></View>
              <Text style={{...styles.text, fontSize: 20}}>Or</Text>
              <View style={styles.horizontalLine}></View>
            </View>

            <TouchableOpacity style={{...styles.button, ...styles.googfbButton}} onPress={signInWithGoogle}>
              <SocialIcon type='google' raised={false} style={styles.icon} iconSize={20} iconColor='#4a6da7' />
              <Text style={styles.text}>Login with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{...styles.button, ...styles.googfbButton}} onPress={signInWithFacebook}>
              <SocialIcon type='facebook' raised={false} style={styles.icon} iconSize={20} iconColor='#4a6da7' />
              <Text style={styles.text}>Login with Facebook</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>
                No account? Create one here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16254b',
  },
  contentContainer: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  button: {
    backgroundColor: '#04b388',
    width: "60%",
    borderRadius: 25,
    height: 50,
    marginVertical: 15,
  },
  mailButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  googfbButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  text: {
    color: 'white',
    letterSpacing: 1.1,
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
    color: '#04b388',
    fontSize: 17,
    textDecorationLine: 'underline',
  },
  horizontalLine: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    width: '30%',
    marginHorizontal: '7%',
    marginBottom: '2.5%'
  },
  icon: {
    marginLeft: 5,
    backgroundColor: '#04b388',
    zIndex: -1,
  },
  footer: {
    backgroundColor: 'white',
    height: '7%',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 25, 
  }
});
