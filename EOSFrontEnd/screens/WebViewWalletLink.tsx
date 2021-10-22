import React, { Component ,useState,useEffect } from 'react';
import { Modal, SafeAreaView, TouchableOpacity, View, Text,Button,StyleSheet, Linking} from 'react-native';
import { WebView } from 'react-native-webview';

const html= require("../assets/html/AnchorLogin")
export function WalletLink({navigation}: {navigation: any})  {
  const [modalVisible, setModalVisible] = useState(true);

  console.log(html)
    return (  
      <View style={{flex : 1, justifyContent : 'center', alignItems: 'center'}}>
                <Modal  visible={modalVisible}>

                    <View style={styles.modal}>
                        <View style={styles.modelHeader}>
                         <TouchableOpacity onPress={() => navigation.goBack()/*()=>{setModalVisible(!modalVisible)}*/}>
                          <Text>Go Back</Text>
                        </TouchableOpacity>
                        </View>
                        <View style={styles.modalContainer}>
                            <WebView 
                                onNavigationStateChange={event => {
                                  console.log("loading")
                                  if (!/^[data:text, about:blank]/.test(event.url)) {
                                    
                                    Linking.openURL(event.url)
                                    return false
                                }
                                return true
                                }}
                                javaScriptEnabled={true}
                                style={{ flex : 1 }} 
                                source={{html: html.template()}}/>
                        </View>
                    </View>
                </Modal>
            </View>
    );
}

  const styles = StyleSheet.create({
    modal : {
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContainer : {
        backgroundColor : 'white',
        width : '100%',
        height : '95%',
    },
    modelHeader : {
      height : '5%',
      justifyContent : 'center',
      alignItems : 'center',
  },
    ActivityIndicatorStyle: {
        flex: 1,
        justifyContent: 'center',
    },
    BackButton:{
      textAlign:'left'
    }
})
