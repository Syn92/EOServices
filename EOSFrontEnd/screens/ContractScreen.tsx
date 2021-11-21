import { RootTabScreenProps } from "../types";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView, Modal } from "react-native";
import * as React from 'react';
import { Icon } from "react-native-elements";
import { ContractRequest, Contract } from '../interfaces/Contracts';
import ServerConstants from "../constants/Server";
import axios from "axios";
import { IService } from "../interfaces/Service";
import Loading from "../components/Loading";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";
import { SliderComponent } from "../components/Slider";
import ActionButton from "../components/ActionButton";
import CountDown from 'react-native-countdown-component'
import ActionButtonSecondary from "../components/ActionButtonSecondary";
import * as ImagePicker from 'expo-image-picker';
import { ExpandImagePickerResult } from "expo-image-picker/build/ImagePicker.types";
import Carousel, { Pagination } from "react-native-snap-carousel";
import {ContractAPI} from "../services/Contract";
import { Rating, AirbnbRating } from 'react-native-ratings';


export default function ContractScreen({route, navigation }: RootTabScreenProps<'Contract'>) {
    let contractId: any = route.params;
    let contractAPI:ContractAPI = ContractAPI.getInstance()
    const [contract, setContract] = React.useState<Contract>();
    const [rating, setRating] = React.useState(0);
    const { user, urlData,setUrlData } =  React.useContext(AuthenticatedUserContext);
    const [time, setTime] = React.useState<number>()
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [ modalVisible, setModalVisible ] = React.useState(true);

    
    React.useEffect(() => {
        if(!urlData)
            return
        let value = urlData.queryParams.value
        if(value == 'accepted'){
            console.log('acceptedValue: ' +value);
            axios.patch(ServerConstants.local + 'post/accept', {serviceId: contract.serviceId, contractId: contract._id}).then(async (res:any) => {
                await fetchContract();
            }).catch(err => console.log(err))
            setUrlData(null)
        } else if(value == 'deposited'){
            console.log('depositedValue: '+ value)
            axios.patch(ServerConstants.local + 'post/deposit', {contractId: contract._id}).then(async (res:any) => {
                await fetchContract();
            }).catch(err => console.log(err))
            setUrlData(null)
        } else if (value == 'received'){
            console.log('receivedValue: '+ value)
            axios.patch(ServerConstants.local + 'post/received', {contractId: contract._id}).then(async (res:any) => {
                await fetchContract();
            }).catch(err => console.log(err))
            setUrlData(null)
        } else if (value == 'delivered'){
            console.log('given: '+ value)
            axios.patch(ServerConstants.local + 'post/delivered', {contractId: contract._id}).then(async (res:any) => {
                await fetchContract();
            }).catch(err => console.log(err))
            setUrlData(null)
        }

    }, [urlData])

    
    const fetchContract = async () => {
        try {
            axios.get(ServerConstants.local + 'post/contract?id='+ contractId.id).then((response: any) => {
                setContract(response.data as Contract);
                let creationTime: number = new Date(response.data.creationDate).getTime() + 259200*1000 //3days in mseconds
                setTime((creationTime - (new Date().getTime()))/1000)
            })
          } catch (e) {
            console.error('Fetch Contract Details: ', e)
          }
    }

    

    React.useEffect(() => {
        fetchContract()
        
    }, [])

    function acceptContract() {
        contractAPI.acceptDeal(contract.dealId, user?.walletAccountName, 'accepted').then((res: any) => {
            console.log(res)
            
        })
    }
    function refuseContract() {
        console.log('Refused')
    }

    function deposit() {
        contractAPI.deposit(contract.dealId, user?.walletAccountName, Number(contract.finalPriceEOS)).then(() => {
           
        })
    }

    function serviceReceived() {
        contractAPI.completeDeal(contract.dealId, user?.walletAccountName, 'received', 'goodsrcvd').catch((err) => {console.log(err)})
    }

    function serviceDelivered() {
        contractAPI.completeDeal(contract.dealId, user?.walletAccountName, 'delivered', 'delivered').catch((err) => {console.log(err)})
    }

    const addPhoto = async () => {
        let result: any = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          quality: 1,
          base64: true,
        });
        if(!result.cancelled){
            axios.post(ServerConstants.local + 'post/contract/image', {contractId: contract._id, image:result.base64}).then(() => {
                fetchContract();
            }).catch((e) => {
                console.log('add photo: ', e)
            })
        }

    }

    function renderBuyerSection(): any {
        return(    
            contract.accepted ?  
                (!contract.deposit ? 
                    <View style={styles.lowerSection}>
                        <ActionButton title="Deposit" onPress={deposit}></ActionButton>
                    </View> :
                <View style={styles.lowerSection}>
                    <SliderComponent isConfirm={contract.serviceReceived} callback={serviceReceived} ></SliderComponent>
                </View>) :
                <View style={styles.contractButtonContainer}>
                    <ActionButtonSecondary styleContainer={{width: '45%', borderRadius: 20}} title="Refuse" onPress={refuseContract}></ActionButtonSecondary>
                    <ActionButton styleContainer={{width: '45%',borderRadius: 20}} title="Accept" onPress={acceptContract}></ActionButton>
                </View>                           
        )
    }
    
    function renderSellerSection(): any {
        return(
            <View style={styles.lowerSection}>
                {contract.accepted ? 
                (contract.deposit ? 
                <View>
                    <SliderComponent  isConfirm={contract.serviceDelivered} callback={serviceDelivered} ></SliderComponent>
                    {contract.serviceDelivered ? null : <ActionButton title="Add photo" onPress={addPhoto}></ActionButton>}

                </View>
                :  <Text style={{textAlign: 'center'}}>Awaiting buyer's deposit... </Text>) :  <Text style={{textAlign: 'center'}}>Awaiting buyer's acceptance... </Text> }
            </View>
        )
    }

    function endRoutine(): any {
        console.log(rating)
        let body = {
            uid: user?.uid == contract.buyer.uid ? contract.seller.uid : contract.buyer.uid,
            rating: rating,
        }
        try {
            axios.post(ServerConstants.local + 'auth/rating', body).then( () => {
                axios.delete(ServerConstants.local + 'post', { params: { id: contract._id } }).then(() => {
                        setModalVisible(false);
                        navigation.navigate('TabThree')
                    })
                }
            ).catch((err) => {console.log(err)})
        } catch (error) {
            console.log(error)
        }
    }

    const _renderItem = ({item, index}) => {
        return (
            <View>
                <Image key={index} source={{uri: item, width: 250, height: 250}}/>
            </View>
        );
    }

    function renderEndModal(): any {
      return (
        <View style={styles.endModalContainer}>
            <Text style={{fontSize: 18, marginTop: '10%'}}>Thank you for using EOS marketplace</Text>
            <View style={{display: 'flex', alignItems: 'center', marginBottom: -25}}>
                <Text style={{fontSize: 25}}>Please Rate: </Text>
                <Text style={{fontSize: 18, fontWeight:'bold',}}>{user?.uid == contract.buyer.uid ? contract.seller.name : contract.buyer.name}</Text>
            </View>

            <Rating
                type="custom"
                ratingTextColor="#04B388"
                showRating={true}
                fractions={1}
                startingValue={2.5}
                onFinishRating={(e: number) => {setRating(e)}}
            />
            <ActionButton styleContainer={{width: '50%', marginBottom: '5%'}} title="Thank you" onPress={endRoutine}></ActionButton>
        </View>
      ); 
    }


    return(
            contract && time?
            <ImageBackground style={{ flex: 1, height: '100%' }} source={require('../assets/images/bg.png')}>
            <ScrollView style={{display: 'flex', flex: 1}}>
            <Modal
                        statusBarTranslucent={true}
                        animationType='fade'
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(false)
                        }}>
                        <View style={styles.centeredView}>
                            {renderEndModal()}
                        </View>
                    </Modal>
                <TouchableOpacity style={styles.backButton} onPress={() => {navigation.goBack()}}>
                    <Icon name="keyboard-arrow-left" size={60} color="#04B388"/>
                  </TouchableOpacity>
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                    <Text style={{fontSize: 25}}>Contract</Text>
                </View>
                <View style={styles.contentCard}>
                    <Icon style={styles.iconCard} size={35} name="tag" type="FontAwesome" color="#04B388"></Icon>
                    <View style={{display:'flex', flexDirection: 'column', width: '80%'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>Title</Text>
                        <Text style={{fontSize: 16}}>{contract.serviceDetail.title}</Text>
                    </View>
                </View>
                <View style={styles.contentCard}>
                    <Icon style={styles.iconCard} size={35} name="person" color="#04B388"></Icon>
                    <View style={{display:'flex', flexDirection: 'column'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>Offered By</Text>
                        <Text style={{fontSize: 16}}>{contract.seller.name}</Text>
                    </View>
                </View>
                <View style={styles.contentCard}>
                    <Icon style={styles.iconCard} size={35} name="money" color="#04B388"></Icon>
                    <View style={{display:'flex', flexDirection: 'column'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>Price</Text>
                        <Text style={{fontSize: 16}}>{contract.finalPriceEOS}</Text>
                    </View>
                </View>
                <View style={styles.contentCard}>
                    <Icon style={styles.iconCard} size={35} name="person" color="#04B388"></Icon>
                    <View style={{display:'flex', flexDirection: 'column', width: '80%'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>Description</Text>
                        <Text style={{fontSize: 16}}>{contract.serviceDetail.description}</Text>
                    </View>
                </View>
                { user?.uid == contract.buyer.uid ? renderBuyerSection() : renderSellerSection() }
            </View>
            { (contract.accepted && contract.deposit) ? 
             contract.images ? <View style={{display: 'flex', flexBasis: '100%', alignContent:'center'}}>
                <Carousel
                  layout={"default"}
                  data={contract.images}
                  sliderWidth={300}
                  itemWidth={250}
                  renderItem={_renderItem}
                  onSnapToItem = { index => setActiveIndex(index) }
                  layoutCardOffset={18}/>
                  <Pagination
                    dotsLength={contract.images.length}
                    activeDotIndex={activeIndex}
                    containerStyle={{}}
                    dotStyle={{
                        marginBottom: 15,
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        elevation: 10,
                        marginHorizontal: 8,
                        backgroundColor: 'white'
                    }}
                    inactiveDotStyle={{
                        // Define styles for inactive dots here
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                  />
            </View> : null : 
            <View>
                <Text style={{color: 'white', textAlign: 'center', marginTop: '5%'}}>Contract expires in: {}</Text>
                {time == 0 ? null : <CountDown until={time} timeLabelStyle={{color: 'white'}} digitStyle={{backgroundColor: 'white'}} size={18}/>}
            </View>}
        </View>
            </ScrollView>
            </ImageBackground> 
            
            
            : <Loading/>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
      },
      cardHeader: {
        display: 'flex',
        flexDirection: 'row',
      },
      cardContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
        marginVertical: 30,
        padding: 10,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: 'white',
      },
      contentCard: {
        alignItems: 'center',
        width: '75%',
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 7,
        paddingVertical: 15,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: 'white',
      },
      backButton: {
        display: 'flex',
        // flexBasis: '10%',
        alignSelf: 'flex-start',
        marginTop: '6%',
      },
      iconCard: {
          marginHorizontal: 10
      },
      contractButtonContainer: {
          width: '80%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: '10%',
          marginBottom: '5%',
      }, 
      lowerSection: {
          width: '90%',
          marginTop: '10%',
          marginBottom: '5%',
      },
      centeredView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.57)',
    },
    modalView: {
        margin: 20,
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 15,
        paddingVertical: 25,
        paddingHorizontal: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    endModalContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        width: '80%',
        height: '45%',
    },
})


