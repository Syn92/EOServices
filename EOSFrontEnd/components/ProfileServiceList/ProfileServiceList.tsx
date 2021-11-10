import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ButtonGroup } from 'react-native-elements'
import { Request, RequestData, RequestIndex, RequestInfo, ServiceData, ServiceInfo } from '../../interfaces/Services'
import { getAddress } from '../../utils/Cadastre'
import { ProfileRequestCard } from './ProfileRequestCard'
import { ProfileServiceCard } from './ProfileServiceCard'

interface Props {
    data: ServiceData | RequestData,
    onUpdate?: () => Promise<void>
}
function instanceOfServiceData(object: any): object is ServiceData {
    return 'open' in object &&
           'inProgress' in object &&
           'completed' in object
}

export function ProfileServiceList(props: Props) {

    const [ index, setIndex ] = useState(0);

    function displayServiceCards(data: Array<Object>) {
        return data.map((elem: any) => {
            const serviceInfo: ServiceInfo = {
                category: elem.category,
                title: elem.title,
                owner: elem.ownerName,
                price: elem.priceEOS,
                position: getAddress(elem.cadastre)
            }
            return (<ProfileServiceCard serviceInfo={serviceInfo} key={serviceInfo.title}/>)
        })
    }

    // ...(index == RequestIndex.incoming && { requestUser: elem.requestUserName }),
    // ...(index == RequestIndex.outgoing && { serviceOwner: elem.serviceDetail.ownerName })

    function displayRequestCards(data: Array<Request>) {
        return data.map((elem: Request) => {
            let res;
            if (index == RequestIndex.incoming)
                res = data.findIndex((e: Request) => (e.serviceID == elem.serviceID) && e._id != elem._id)            

            let requestInfo: RequestInfo = {
                thumbnail: elem.serviceDetail.thumbnail,
                title: elem.serviceDetail.title,
                ...(index == 0 && {isUnique: res == -1}),
                ...(index == RequestIndex.incoming && { requestUser: elem.requestUserName }),
                ...(index == RequestIndex.outgoing && { serviceOwner: elem.serviceDetail.ownerName })

            }
            return (
                <ProfileRequestCard key={elem._id} requestInfo={requestInfo} request={elem} onUpdate={props.onUpdate}/>
            )
        })
    }
    
    function serviceView() {

        const data = props.data as ServiceData


        return (
            <View style={styles.container}>
                <ButtonGroup
                    onPress={setIndex}
                    selectedButtonStyle={{backgroundColor: '#04b388'}}
                    selectedIndex={index}
                    buttons={['Open', 'In Progress', 'Completed']}
                    containerStyle={styles.buttonGroup}/>
                {
                    index == 0 ? 
                        displayServiceCards(data.open) : 
                    ( index == 1 ? 
                        displayServiceCards(data.inProgress) : 
                        displayServiceCards(data.completed)
                    )
                }
            </View>
        )
    }

    function requestView() {

        const data = props.data as RequestData

        return (
            <View style={styles.container}>
                <ButtonGroup
                    onPress={setIndex}
                    selectedButtonStyle={{backgroundColor: '#04b388'}}
                    selectedIndex={index}
                    buttons={['Incoming', 'Outgoing']}
                    containerStyle={styles.buttonGroup}/>
                {
                    index == 0 ? displayRequestCards(data.incoming) : displayRequestCards(data.outgoing)
                }
            </View>
        )
    }

    return (instanceOfServiceData(props.data) ? serviceView() : requestView())
}

const styles = StyleSheet.create({
    container: {
        width: '88%',
        marginBottom: 10, 
        alignSelf: 'center',
        padding: 5,
        
        borderRadius: 15,
        backgroundColor: 'white',
    },
    buttonGroup: {
        borderRadius: 20
    },
})