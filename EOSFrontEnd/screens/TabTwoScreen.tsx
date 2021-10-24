import axios from 'axios';
import * as React from 'react';
import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import Firebase from '../config/firebase';

const auth = Firebase.auth()

async function handleLogout() {
  try {
    await auth.signOut()
  } catch (error: any) {
    console.log(error)
  }
}

export default function TabTwoScreen({ navigation }: RootTabScreenProps<'TabTwo'>){
  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabTwoScreen.tsx" />
      <Button title="AddPost" onPress={() => {navigation.navigate('AddPost')}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
