import axios from 'axios';
import * as React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-elements/dist/buttons/Button';
import Map from '../components/Map';

import EditScreenInfo from '../components/EditScreenInfo';
import { RootTabScreenProps } from '../types';
import Firebase from '../config/firebase';
import { Icon } from 'react-native-elements';
import { useState, useEffect } from 'react';
import ServerConstants from '../constants/Server';
import { PostCard } from '../components/PostCard';
import { TextInput } from 'react-native-gesture-handler';
import { CustomFeature, getAddress } from '../utils/Cadastre';
import { LatLng } from 'react-native-maps';
import ActionButtonSecondary from '../components/ActionButtonSecondary';

export interface Service {
  title: string;
  description: string;
  material: string;
  priceEOS: number;
  serviceType: string;
  category: string;
  cadastre: CustomFeature;
  markerPos: LatLng;
  owner: string;
  ownerName: string;
  thumbnail: string;
  _id: string;
}


const auth = Firebase.auth()

async function handleLogout() {
  try {
    await auth.signOut()
  } catch (error: any) {
    console.log(error)
  }
}

const filterNone: string = 'none';
const filterCat1: string = 'cat1';
const filterCat2: string = 'cat2';
const filterCat3: string = 'cat3';


export default function TabTwoScreen({ navigation }: RootTabScreenProps<'TabTwo'>){
  const [data, setData] = useState([]);
  const [searchString, setSearchString] = useState('');
  // const [services, setServices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterCatSelected, setFilterCatSelected] = useState(filterNone)
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try{
      const resp = await fetch(ServerConstants.local + 'post/list');
      const data = await resp.json();
      setData(data);
      setLoading(false);
    } catch (e) {
      setLoading(false)
      console.error('Fetch annonces tab one: ', e)
    }
  };

  const onCardPress = (serv: Service) => {
    // console.log(serv)
    navigation.navigate('PostDetails',serv._id);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.appHeader}>
        <Text style={styles.title}>EOS MARKETPLACE</Text>
      </View>
      <View style={styles.mapContainer}>
        <Map pressable={false} services={data} />
      </View>
      <View style={styles.searchSection}>
        <Icon style={styles.searchIcon} name="search" size={20} color="#04B388"/>
        <TextInput
            style={styles.input}
            placeholder="Search in marketplace..."
            placeholderTextColor="#04B388"
            onChangeText={(searchString) => {setSearchString(searchString)}}
            underlineColorAndroid="transparent"
        />
        <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(false);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Filter by...</Text>
                    <View style={styles.modalButtonContainer}>
                      <ActionButtonSecondary  title="None" styleContainer={[filterCatSelected == filterNone ? {backgroundColor: '#04B388'} : {backgroundColor: 'white'}, {margin: 5}]} styleText={filterCatSelected == filterNone ? {color: 'white'} : {color: '#04B388'}} onPress={() => {setFilterCatSelected(filterNone); setModalVisible(false)}}></ActionButtonSecondary>
                      <ActionButtonSecondary  title="Cat1" styleContainer={[filterCatSelected == filterCat1 ? {backgroundColor: '#04B388'} : {backgroundColor: 'white'}, {margin: 5}]} styleText={filterCatSelected == filterCat1 ? {color: 'white'} : {color: '#04B388'}} onPress={() => {setFilterCatSelected(filterCat1); setModalVisible(false)}}></ActionButtonSecondary>
                      <ActionButtonSecondary  title="Cat2" styleContainer={[filterCatSelected == filterCat2 ? {backgroundColor: '#04B388'} : {backgroundColor: 'white'}, {margin: 5}]} styleText={filterCatSelected == filterCat2 ? {color: 'white'} : {color: '#04B388'}} onPress={() => {setFilterCatSelected(filterCat2); setModalVisible(false)}}></ActionButtonSecondary>
                      <ActionButtonSecondary  title="Cat3" styleContainer={[filterCatSelected == filterCat3 ? {backgroundColor: '#04B388'} : {backgroundColor: 'white'}, {margin: 5}]} styleText={filterCatSelected == filterCat3 ? {color: 'white'} : {color: '#04B388'}} onPress={() => {setFilterCatSelected(filterCat3); setModalVisible(false)}}></ActionButtonSecondary>
                    </View>
                  </View>
                </View>
              </Modal>
      </View>
      <View style={styles.listContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Posts</Text>
          <View style={styles.buttonContainer}>
            <Button icon={<Icon name="refresh" size={30} color="#04B388"/>} onPress={() => {fetchData()}} />
            <Button icon={<Icon name="add" size={30} color="#04B388"/>} onPress={() => {navigation.navigate('AddPost')}} />
            <Button icon={<Icon name="filter-alt" size={30} color="#04B388"/>} onPress={() => {setModalVisible(true)}} />
            <Button icon={<Icon name="sort" size={30} color="#04B388"/>} onPress={() => {navigation.navigate('AddPost')}} />
          </View>
        </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

       {
         data.filter((e:Service) => (e.title.startsWith(searchString.toLowerCase()) && (filterCatSelected == filterNone ? true : e.category == filterCatSelected))).map((e: Service) => {
           return(
             <TouchableOpacity onPress={() => {onCardPress(e)}} key={e._id}>
               <PostCard title={e.title} price={e.priceEOS} position={getAddress(e.cadastre)} owner={e.ownerName} thumbnail={e.thumbnail}></PostCard>
             </TouchableOpacity>)
         })
       }
        </ScrollView>
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
  appHeader: {
    justifyContent: 'flex-end',
    // alignContent: 'flex-start',
    display: 'flex',
    flexBasis: '15%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
    marginBottom: 15,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  headerRow: {
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'row',
  },
  headerText: {
    color: "#04B388",
    fontSize: 25,
    textAlign: 'left',
    marginLeft: 10,
    marginTop: 5,
    flexBasis: 150,

  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexBasis: 100,
  },
  mapContainer: {
    justifyContent: 'flex-start',
    width: '90%',
    flexBasis: '30%',
  },
  listContainer: {
    // minHeight: '100%',
    backgroundColor: 'white',
    height: '55%',
    // flexBasis: '50%',
    display: 'flex',
    flexDirection: 'column',
    width: '85%',
    borderRadius: 15,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignContent: 'center',
    elevation: 5,
    marginBottom: 50,
  },
  scrollContainer: {
    // flexBasis: '100%',
    // minHeight: '100%',
    // flex: 1,
    marginBottom: 50,
  },
  searchInput: {
    margin: 20,
    padding: 5,
    borderWidth: 1,
    borderRadius: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignContent: 'center',
  },
  searchSection: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 1,
    margin: 10,
},
searchIcon: {
    padding: 10,
},
input: {
    // flex: 1,
    paddingTop: 5,
    paddingRight: 25,
    paddingBottom: 5,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#04B388',
    borderRadius: 25,

},
centeredView: {
  flex: 1,
  justifyContent: "center",
  backgroundColor: 'transparent',
  alignItems: "center",
  marginTop: 22
},
modalView: {
  margin: 20,
  backgroundColor: "white",
  borderRadius: 20,
  padding: 35,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5
},
modalText: {
  marginBottom: 15,
  textAlign: "center"
},
button: {
  borderRadius: 20,
  padding: 10,
  elevation: 2
},
buttonOpen: {
  backgroundColor: "#F194FF",
},
buttonClose: {
  backgroundColor: "#2196F3",
},
textStyle: {
  color: "white",
  fontWeight: "bold",
  textAlign: "center"
},
modalButtonContainer: {
  display: 'flex',
  flexDirection: 'column',
  width: 150
}
});
