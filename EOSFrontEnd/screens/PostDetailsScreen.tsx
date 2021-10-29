import * as React from 'react';
import { StyleSheet, Text, Image } from 'react-native';
import { View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { LatLng } from 'react-native-maps';
import { Service } from './TabTwoScreen';
import { servTypeSell } from './AddPostScreen';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import ServerConstants from '../constants/Server';
import Loading from '../components/Loading';
import Carousel, { Pagination } from 'react-native-snap-carousel';


export default function PostDetailsScreen({route, navigation }: RootTabScreenProps<'PostDetails'>) {
    const id: any = route.params;
    
    const [service, setService] = React.useState<any>();
    const [loading, setLoading] = React.useState(true);
    const [activeIndex, setActiveIndex] = React.useState(0);

    const fetchData = async () => {
        axios.get(ServerConstants.local + 'post/?id='+id).then((response) => {
            console.log(response);
            setService(response.data);
            setLoading(false);
        })
    }

    const _renderItem = ({item, index}) => {
        return (
            <View>
                <Image key={index} source={{uri: 'data:image/png;base64,' + item, width: 250, height: 250}}/>
            </View>
        );
    }

    React.useEffect(() => {
        fetchData();
    }, [])
    
        return (
          !loading ? <View style={styles.container}>
              <View style={styles.cardContainer}>
                <Image style={styles.image} source={{uri: 'data:image/png;base64,' + service.thumbnail, width: 50, height: 50}}/>
                <Text style={styles.imageTitle}>{service.title}</Text>
                <View style={styles.contentCard}>
                    <Icon style={styles.iconCard} name="storefront" color="#04B388"></Icon>
                    <Text>{service.ServType == servTypeSell ? 'Offered by ' : 'Searched by '}{service.ownerName}</Text>
                </View>

                <View style={styles.contentCard}>
                    <Icon style={styles.iconCard} name="place" color="#04B388"></Icon>
                    <Text style={styles.textCard}>insert ADRESS</Text>
                </View>

                <View style={styles.contentCard}>
                    <Icon style={styles.iconCard} name="pan-tool" color="#04B388"></Icon>
                    <Text style={styles.textCard}>{service.material}</Text>
                </View>

                <View style={styles.contentCard}>
                    <Icon style={styles.iconCard} name="attach-money" color="#04B388"></Icon>
                    <Text style={styles.textCard}>{service.priceEOS} EOS</Text>
                </View>

                <View style={styles.contentCard}>
                    <Icon style={styles.iconCard} name="description" color="#04B388"></Icon>
                    <Text style={styles.textCard}>{service.description}</Text>
                </View>

                {/* {   
                    service.images ? service.images.map((e: any, i: number) => {
                        return (<Image key={i} source={{uri: 'data:image/png;base64,' + e, width: 150, height: 150}}/>)
                    }) : <View></View>
                } */}
                <Carousel
                  layout={"default"}
                  data={service.images}
                  sliderWidth={300}
                  itemWidth={250}
                  renderItem={_renderItem}
                  onSnapToItem = { index => setActiveIndex(index) } 
                  layoutCardOffset={18}/>
                  <Pagination
                    dotsLength={service.images.length}
                    activeDotIndex={activeIndex}
                    containerStyle={{ backgroundColor: 'white' }}
                    dotStyle={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginHorizontal: 8,
                        backgroundColor: '#04B388'
                    }}
                    inactiveDotStyle={{
                        // Define styles for inactive dots here
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                  />
              </View>
          </View> : <Loading></Loading>
        )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column'
  },
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    marginVertical: 10,
    padding: 5,
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
  image: {
    borderRadius: 25,
    marginHorizontal: 15,
  },
  imageTitle: {
    textDecorationLine: 'underline',
    color: '#04B388',
    fontSize: 16,
    textTransform: 'capitalize'
  },
  contentCard: {
    alignItems: 'center',
    width: '75%',
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 10,
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
  iconCard: {marginHorizontal: 5},
  textCard: {width: '85%'}
});
