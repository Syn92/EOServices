import { RootTabScreenProps } from "../types";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import * as React from 'react';
import { Icon } from "react-native-elements";
import { ContractRequest } from "../interfaces/Contracts";
import ServerConstants from "../constants/Server";
import axios from "axios";
import { IService } from "../interfaces/Service";

export default function ContractScreen({route, navigation }: RootTabScreenProps<'Contract'>) {
    let contractId: any = route.params;
    const [service, setService] = React.useState<IService>();
    const [contract, setContract] = React.useState<ContractRequest>();
    const [loading, setLoading] = React.useState(true)

    const fetchContract = async () => {
        try {
            axios.get(ServerConstants.local + 'requests/?id='+ contractId.id).then((response) => {
                setContract(response.data as ContractRequest);
                setLoading(false);
            })
          } catch (e) {
            setLoading(false)
            console.error('Fetch Contract Details: ', e)
          }
    }

    const fetchService = async () => {
        try {
          axios.get(ServerConstants.local + 'post/?id='+ contractId.id).then((response) => {
              setService(response.data as IService);
              setLoading(false);
          })
        } catch (e) {
          setLoading(false)
          console.error('Fetch Service Details: ', e)
        }
      }

    React.useEffect(() => {
        fetchService();
        fetchContract();
    })
    return(
            <ImageBackground style={{ flex: 1 }} source={require('../assets/images/bg.png')}>
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
                        <Text style={{fontSize: 16}}>{service.title}</Text>
                    </View>
                </View>
                <View style={styles.contentCard}>
                    <Icon style={styles.iconCard} size={35} name="person" color="#04B388"></Icon>
                    <View style={{display:'flex', flexDirection: 'column'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>Sold By</Text>
                        <Text style={{fontSize: 16}}>{contractInfo.seller}</Text>
                    </View>
                </View>
                <View style={styles.contentCard}>
                    <Icon style={styles.iconCard} size={35} name="money" color="#04B388"></Icon>
                    <View style={{display:'flex', flexDirection: 'column'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>Price</Text>
                        <Text style={{fontSize: 16}}>{contractInfo.finalPriceEOS}</Text>
                    </View>
                </View>
                <View style={styles.contentCard}>
                    <Icon style={styles.iconCard} size={35} name="person" color="#04B388"></Icon>
                    <View style={{display:'flex', flexDirection: 'column'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>Sold By</Text>
                        <Text style={{fontSize: 16}}>{service.description}</Text>
                    </View>
                </View>
            </View>
        </View>
            </ImageBackground>
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
      }
})