import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ButtonGroup } from 'react-native-elements'
import { Request, RequestData, RequestIndex, RequestInfo, ServiceData, ServiceInfo } from '../../interfaces/Services'
import { getAddress } from '../../utils/Cadastre'
import { ProfileRequestCard } from './ProfileRequestCard'
import { ProfileServiceCard } from './ProfileServiceCard'

interface Props {
    data: ServiceData | RequestData | Array<Object>,
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
                _id: elem._id,
                category: elem.category,
                title: elem.title,
                owner: elem.ownerName,
                price: elem.priceEOS,
                position: getAddress(elem.cadastre)
            }
            return (<ProfileServiceCard serviceInfo={serviceInfo} key={serviceInfo.title} />)
        })
    }


    // Private profile requests (incoming / ongoing)
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
    
    // Profile services
    function serviceView() {

        // Private profile
        if (instanceOfServiceData(props.data)) {
            let data;
            switch (index) {
                default:
                case 0:
                    data = (props.data as ServiceData).open
                    break;

                case 1:
                    data = (props.data as ServiceData).inProgress
                    break;
                
                case 2:
                    data = (props.data as ServiceData).completed
                    break;
            }
            return (
                <View style={styles.container}>
                    <ButtonGroup
                        onPress={setIndex}
                        selectedButtonStyle={{backgroundColor: '#04b388'}}
                        selectedIndex={index}
                        buttons={['Open', 'In Progress', 'Completed']}
                        containerStyle={styles.buttonGroup}/>
                    {displayServiceCards(data)}
                </View>
            )

        // Public profile
        } else {
            const data = props.data as Array<Object>
            return (
                <View style={styles.container}>                        
                    { displayServiceCards(data) }
                </View>
            )
        }
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

    if (Array.isArray(props.data) || instanceOfServiceData(props.data)) return serviceView()
    else return requestView()
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