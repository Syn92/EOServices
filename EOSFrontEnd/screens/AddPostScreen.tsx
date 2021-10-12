import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements/dist/buttons/Button';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import ActionButton from '../components/ActionButton';
import ActionButtonSecondary from '../components/ActionButtonSecondary';
import { useState } from 'react';

export default function AddPostScreen() {
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState('');
  if (step == 1)
    return (
    <View style={styles.container}>
      <Text style={styles.title}>AddPost</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.innerContainer}>
        <Text style={styles.subTitle}>You are intersted in...</Text>
        <View style={styles.buttonContainer}>
          <ActionButtonSecondary  title="Items" styleContainer={selected == 'Items' ? {backgroundColor: '#04B388'} : {backgroundColor: 'white'}} styleText={selected == 'Items' ? {color: 'white'} : {color: '#04B388'}} onPress={() => {setSelected('Items')}}></ActionButtonSecondary>
            <ActionButtonSecondary styleContainer={[{marginTop: 10}, selected == 'Services' ? {backgroundColor: '#04B388'} : {backgroundColor: 'white'}]} styleText={selected == 'Services' ? {color: 'white'} : {color: '#04B388'}} title="Services" onPress={() => {setSelected('Services')}}></ActionButtonSecondary>
            <ActionButton title="Next" onPress={() => {setStep(2); console.log(step)}}></ActionButton>
        </View>
        
      </View>
    </View>
  );
  else 
      return (
      <View style={styles.container}>
        <Text style={styles.title}>AddPost</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      </View>
      )
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
