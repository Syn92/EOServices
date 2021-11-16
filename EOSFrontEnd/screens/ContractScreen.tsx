import { RootTabScreenProps } from "../types";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
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

export default function ContractScreen({route, navigation }: RootTabScreenProps<'Contract'>) {
    let contractId: any = route.params;

    const [contract, setContract] = React.useState<Contract>();
    const [loading, setLoading] = React.useState(true)
    const { user, setUser } =  React.useContext(AuthenticatedUserContext);
    const [time, setTime] = React.useState<number>()
    const [isConfirm, setConfirmed] = React.useState(false)
    

    const fetchContract = async () => {
        try {
            axios.get(ServerConstants.local + 'post/contract?id='+ contractId.id).then((response: any) => {
                setContract(response.data as Contract);
                let creationTime: number = new Date(response.data.creationDate).getTime() + 259200*1000 //3days in mseconds
                if(!time)setTime((creationTime - (new Date().getTime()))/1000)
            })
          } catch (e) {
            console.error('Fetch Contract Details: ', e)
          }
    }

    const myMethod = () => {
        console.log('slided')
        setConfirmed(true);
    }
    

    React.useEffect(() => {
        fetchContract()
    })

    function acceptContract() {
        console.log('Accepted')
    }
    function refuseContract() {
        console.log('Refused')
    }

    function deposit() {
        console.log(deposit);
    }

    function renderBuyerSection(): any {
        return(
            
                
            !contract.accepted ?  
                (contract.deposit ? 
                    <View style={styles.lowerSection}>
                        <ActionButton title="Deposit" onPress={deposit}></ActionButton>
                    </View> :
                <View style={styles.lowerSection}>
                    <SliderComponent isConfirm={isConfirm} callback={myMethod} ></SliderComponent>
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
                {contract.accepted ? (contract.deposit ? <SliderComponent  isConfirm={isConfirm} callback={myMethod} ></SliderComponent> :  <Text>Awaiting buyer's deposit... </Text>) :  <Text>Awaiting buyer's acceptance... </Text> }
            </View>
        )
    }

    function computeCountdown(): number {
        let currentDate: Date = new Date();
        let time: number = contract.creationDate.getTime() - currentDate.getTime();
        return time/1000 // ms to second
    }
    


    return(
            contract ? <ImageBackground style={{ flex: 1 }} source={require('../assets/images/bg.png')}>
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
                    <View style={{display:'flex', flexDirection: 'column'}}>
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
                    <View style={{display:'flex', flexDirection: 'column'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>Description</Text>
                        <Text style={{fontSize: 16}}>{contract.serviceDetail.description}</Text>
                    </View>
                </View>
                { user?.uid == contract.buyer.uid ? renderBuyerSection() : renderSellerSection() }
            </View>
            <Text style={{color: 'white', textAlign: 'center', marginTop: '5%'}}>Contract expires in: {}</Text>
            {time == 0 ? null : <CountDown until={time} timeLabelStyle={{color: 'white'}} digitStyle={{backgroundColor: 'white'}} size={18}/>}
        </View>
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
      }
})


