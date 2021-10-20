import * as React from 'react';
import { Platform, StyleSheet, TextInput, Image } from 'react-native';
import { Button } from 'react-native-elements/dist/buttons/Button';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import ActionButton from '../components/ActionButton';
import ActionButtonSecondary from '../components/ActionButtonSecondary';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-community/picker';
import { Icon } from 'react-native-elements';
import {Dimensions} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import StepIndicator from '../components/stepIndicator';
const { height } = Dimensions.get('window');

const itemType = "Items";
const serviceType = "Services"
const servTypeSell = "sell"
const servTypeBuy = "buy"

export default function AddPostScreen() {
  const [step, setStep] = useState(1)
  const [selectedServType, setSelectedServType] = useState<string>();
  const [selectedCat, setSelectedCat] = useState<string>('');
  const [price, setPrice] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [position, setPositon] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [material, setMaterial] = useState<string>();

  const [image, setImage] = useState<any[]>([]);

  function addPostRequest(){
    console.log('2')
    let body = JSON.stringify({
      'serviceType': selectedServType,
      'category': selectedCat,
      'price': price,
      'description': description,
      'material': material,
      'images': image,
      'positon': position,
    })
  }

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      let images = [...image];
      images.push(<Image source={{uri: result.uri, width: 80, height: 80}} key={result.uri}/>)
      setImage(images);
    }
  };
  if(step == 1) 
    return (
    <View style={styles.container}>
      <StepIndicator title="Add a post" step={step} stepMax={3}></StepIndicator>
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
      <View style={styles.innerContainer}>
        <Text style={styles.subTitle}>You are ...</Text>
        <View style={styles.buttonContainer}>
          <ActionButtonSecondary  title="Looking For" styleContainer={selectedServType == servTypeSell ? {backgroundColor: '#04B388'} : {backgroundColor: 'white'}} styleText={selectedServType == servTypeSell ? {color: 'white'} : {color: '#04B388'}} onPress={() => {setSelectedServType(servTypeSell)}}></ActionButtonSecondary>
            <ActionButtonSecondary styleContainer={[{marginTop: 30}, selectedServType == servTypeBuy ? {backgroundColor: '#04B388'} : {backgroundColor: 'white'}]} styleText={selectedServType == servTypeBuy ? {color: 'white'} : {color: '#04B388'}} title="Offering" onPress={() => {setSelectedServType(servTypeBuy)}}></ActionButtonSecondary>
        </View>
        <ActionButton title="Next" styleContainer={[{justifySelf: 'flex-end', margin:50}]} onPress={() => {if(selectedServType){setStep(2)}; console.log(selectedServType)}}></ActionButton>
      </View>
    </View>
    );
    else if (step == 2)
        return(
          <View style={styles.container}>
          <StepIndicator title="Add a post" step={step} stepMax={3}></StepIndicator>
          <View style={styles.innerContainer}>
            <View style={styles.header}>
            <Button style={styles.headerButton} onPress={() => setStep(1)} icon={<Icon name="arrow-left" size={40} color="black"/>}/>
            <Text style={styles.subTitle}>Details</Text>
            </View>
            <View style={styles.buttonContainer}>
              <Text style={styles.inputLabel}>Categorie</Text>
              <Picker mode="dropdown" style={styles.buttonStyle} selectedValue={selectedCat} onValueChange={(itemValue, itemIndex) => {if(itemValue != "0")setSelectedCat(itemValue.toString())}}>
                <Picker.Item label="Select a Cat..." value="0"/>
                <Picker.Item label="Cat1" value="cat1"/>
                <Picker.Item label="Cat2" value="cat2"/>
                <Picker.Item label="Cat3" value="cat3"/>
              </Picker>
              <ActionButtonSecondary title="Add photos" styleContainer={{marginTop: 30}} onPress={pickImage}></ActionButtonSecondary>
              <View style={styles.inputView}>
                <Text style={styles.inputLabel}>Price</Text>
                <TextInput
                  style={{color: 'black'}}          
                  autoCapitalize='none'
                  autoCorrect={false}
                  value={price}
                  onChangeText={(text: string) => setPrice(text.replace(/[^0-9]/g, ''))}
                />
              </View>
              <View style={styles.inputView}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={{color: 'black'}}          
                  autoCapitalize='none'
                  autoCorrect={false}
                  value={description}
                  onChangeText={(text: string) => setDescription(text)}
                />
              </View>
             <View style={styles.inputView}>
                <Text style={styles.inputLabel}>Material required</Text>
                <TextInput
                  style={{color: 'black'}}          
                  autoCapitalize='none'
                  autoCorrect={false}
                  value={material}
                  onChangeText={(text: string) => setMaterial(text)}
                />
              </View>
            </View>
            <View style={styles.photoContainer}>
              {
                image
              }
            </View>
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : <Text></Text>}
            <View style={{justifyContent: 'flex-end', marginHorizontal: 50, marginVertical: 10}}>
              <ActionButton title="Next" onPress={() => {if(material && description && price && selectedCat){setStep(3); setErrorMessage('')}else{setErrorMessage('Please complete all fields above')}; console.log(step)}}></ActionButton>
            </View>
          </View>
        </View>
        );
      else if(step == 3)
        return (
          <View style={styles.container}>
          <StepIndicator title="Add a post" step={step} stepMax={3}></StepIndicator>
          <View style={styles.innerContainer}>
          <View style={styles.header}>
            <Button style={styles.headerButton} onPress={() => setStep(2)} icon={<Icon name="arrow-left" size={40} color="black"/>}/>
            <Text style={styles.subTitle}>Location</Text>
            </View>
            <View style={styles.buttonContainer}>
              <View style={styles.inputView}>
                <Text style={styles.inputLabel}>Position</Text>
                <TextInput
                  style={{color: 'black'}}          
                  autoCapitalize='none'
                  autoCorrect={false}
                  value={position}
                  onChangeText={(text: string) => setPositon(text)}
                />
              </View>
            </View>
            <View style={{justifyContent: 'flex-end', marginHorizontal: 50, marginVertical: 10}}>
              <ActionButton title="Confirm" onPress={addPostRequest}></ActionButton>
            </View>
          </View>
        </View>
        )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#16254b',
    alignItems: 'center',
    flexDirection: 'column'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between'
  },
  headerButton: {
    alignSelf: 'flex-start',
    width: 50,
    justifyContent: 'flex-start',
  }, 
  subTitle: {
    marginTop: 10,
    fontSize: 20,
    color: '#16254b',
    alignSelf: 'center',
    marginHorizontal: '20%'
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '75%',
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
    marginTop: 30,
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  buttonContainer: {
    width: '50%',
    alignSelf: 'center',
    paddingTop: 20,
    display: 'flex',
    flexDirection: 'column'
  },
  buttonStyle: {
    backgroundColor: '#fff',
    elevation: 8,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: '#04B388',
    alignContent: 'center',
    justifyContent: 'center'
  },
  inputView: {
    // width: "100%",
    marginVertical: 10,
    borderBottomWidth: 2,
    borderColor: '#152347',
  },
  inputLabel: {
    fontSize: 16,
    color: '#04b388',
  },
  text: {
    fontSize: 20,
    color: 'black',
    paddingVertical: 15,
    alignSelf: 'center'
  },
  photoContainer: {
    alignSelf: 'center',
    width: '80%',
    flexWrap: 'wrap',
    flexDirection: "row",
    marginHorizontal: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center'
  }
});
