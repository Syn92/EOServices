import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements/dist/buttons/Button';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import ActionButton from '../components/ActionButton';
import ActionButtonSecondary from '../components/ActionButtonSecondary';

export default function AddPostScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AddPost</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.innerContainer}>
        <Text style={styles.subTitle}>You are intersted in...</Text>
        <View style={styles.buttonContainer}>
          <ActionButtonSecondary  title="Items" onPress={() => console.log('clicked')}></ActionButtonSecondary>
            <ActionButtonSecondary styleContainer={{marginTop: 10,}} title="Services" onPress={() => console.log('clicked')}></ActionButtonSecondary>

        </View>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {

    width: '70%',
    height: '80%',
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignContent: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 20,
    color: '#04B388',
    alignSelf: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonContainer: {
    width: '50%',
    alignSelf: 'center',
    paddingTop: 50,
  },
});
