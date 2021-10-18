import * as React from 'react';
import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import Firebase from '../config/firebase';
import { RootTabScreenProps } from '../types';

const auth = Firebase.auth()

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  async function handleLogout() {
    try {
      await auth.signOut()
    } catch (error: any) {
      console.log('logout')
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
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
