import * as React from 'react';
import { ImageBackground, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-elements/dist/buttons/Button';
import Map from '../components/Map';
import { RootTabScreenProps } from '../types';
import Firebase from '../config/firebase';
import { Icon } from 'react-native-elements';
import { useState, useEffect } from 'react';
import ServerConstants from '../constants/Server';
import { PostCard } from '../components/PostCard';
import { TextInput } from 'react-native-gesture-handler';
import { getAddress } from '../utils/Cadastre';
import ActionButtonSecondary from '../components/ActionButtonSecondary';
import { IService } from '../interfaces/Service';
import { ServiceStatus } from '../interfaces/Services';
import axios from 'axios';
import { filterCat, servTypeSell, servTypeBuy } from '../constants/Utils';

const auth = Firebase.auth()

async function handleLogout() {
  try {
    await auth.signOut()
  } catch (error: any) {
    console.log(error)
  }
}

const filterNone: string = 'none';
const noneServType: string = 'none';




export default function TabTwoScreen({ navigation }: RootTabScreenProps<'TabTwo'>){
  const [data, setData] = useState([]);
  const [searchString, setSearchString] = useState('');
  // const [services, setServices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterCatSelected, setFilterCatSelected] = useState(filterNone)
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(noneServType)
  const [selectedCadastre, setSelectedCadastre] = useState<string>()
  var scrollViewRef: any = React.useRef();
  var mapid_y: any = {};
  const fetchData = async () => {
    try{
      const resp = await axios.get<Array<Object>>(ServerConstants.local + 'post/open');
      const respData: Array<Object> = resp.data
      setData(respData);
      setLoading(false);
    } catch (e) {
      setLoading(false)
      console.error('Fetch annonces tab one: ', e)
    }
  };

  const onCardPress = (serv: IService) => {
    // console.log(serv)
    navigation.navigate('PostDetails',serv._id);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ImageBackground style={{ flex: 1 }} source={require('../assets/images/bg.png')}>
    <View style={styles.container}>
      <View style={styles.appHeader}>
        <Text style={styles.title}>EOS MARKETPLACE</Text>
      </View>
      <View style={styles.mapContainer}>
        <Map pressable={false} services={data} onMarkerPressed={(id) => { setSelectedCadastre(id);scrollViewRef.current?.scrollTo({y: mapid_y[id], animated: true})}} />
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
                <Pressable style={styles.centeredView} onPress={() => setModalVisible(false)}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Filter by...</Text>
                    <ScrollView style={styles.modalButtonContainer}>
                      {filterCat.map((cat: string) => {
                        return(
                        <ActionButtonSecondary key={cat}  title={cat} styleContainer={[filterCatSelected == cat ? {backgroundColor: '#04B388'} : {backgroundColor: 'white'}, {margin: 5}]} styleText={filterCatSelected == cat ? {color: 'white'} : {color: '#04B388'}} onPress={() => {setFilterCatSelected(cat); setModalVisible(false)}}></ActionButtonSecondary>)
                      })}
                    </ScrollView>
                  </View>
                </Pressable>
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
          <View style={styles.buttonTypeContainer}>
            <ActionButtonSecondary styleContainer={[styles.typeButtonLeft, (selectedType == servTypeSell) ? {backgroundColor: '#04B388'} : {backgroundColor: 'white'}]} title="Offering" onPress={() => {if(selectedType != servTypeSell) setSelectedType(servTypeSell); else {setSelectedType(noneServType)}}} styleText={selectedType == servTypeSell ? {color: 'white'} : {color: '#04B388'}}></ActionButtonSecondary>
            <ActionButtonSecondary styleContainer={[styles.typeButtonRight,(selectedType == servTypeBuy) ? {backgroundColor: '#04B388'} : {backgroundColor: 'white'} ]} title="Looking for" onPress={() => {if(selectedType != servTypeBuy) setSelectedType(servTypeBuy); else {setSelectedType(noneServType)}}} styleText={selectedType == servTypeBuy ? {color: 'white'} : {color: '#04B388'}}></ActionButtonSecondary>
          </View>
      <ScrollView  onScrollBeginDrag={()=> {setSelectedCadastre('')}} ref={scrollViewRef} contentContainerStyle={styles.scrollContainer}>

       {
         data.filter((e:IService) => (e.title.startsWith(searchString.toLowerCase()) && (filterCatSelected == filterNone ? true : e.category == filterCatSelected) && (selectedType == noneServType ? true : e.serviceType == selectedType))).map((e: IService) => {
           return(
             <TouchableOpacity onLayout={(x) => {mapid_y[e.cadastreId] = x.nativeEvent.layout.y }} onPress={() => {onCardPress(e)}} key={e._id} style={selectedCadastre == e.cadastreId ? {borderWidth: 1, borderColor: '#04B388'} : null}>
               <PostCard title={e.title} price={e.priceEOS} position={getAddress(e.cadastre)} owner={e.ownerName} thumbnail={e.thumbnail ? e.thumbnail : 'https://cdn1.iconfinder.com/data/icons/business-company-1/500/image-512.png'}></PostCard>
             </TouchableOpacity>)
         })
       }
        </ScrollView>
      </View>
    </View>
    </ImageBackground>
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
    color: 'white',
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
  buttonTypeContainer: {
    alignContent: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 25,
    marginBottom: 5,
  },
  typeButtonLeft: {
    width: '50%',
    borderBottomLeftRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    borderRightWidth: 1,
    borderRightColor: '#04B388',
  },
  typeButtonRight: {
    width: '50%',
    borderBottomRightRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    borderLeftWidth: 1,
    borderLeftColor: '#04B388'
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
  height: '50%',
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
  width: '80%',
}
});
