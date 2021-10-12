import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { LatLng, Marker, Region, UrlTile } from 'react-native-maps';

interface IState {
    region: Region;
}

export default class Map extends React.Component<{}, IState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            region: {
                latitude: 45.5017,
                longitude: -73.5673,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
        };
    }

    onRegionChange(region: Region) {
        // this.setState({ region });
    }

    render() {
        const testMarkerCoord: LatLng = {
            latitude: 45.5048,
            longitude: -73.6132,
        };
        return (
            <View style={this.styles.container}>
                <MapView style={this.styles.map} region={this.state.region} onRegionChange={this.onRegionChange.bind(this)}>
                    <UrlTile urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maximumZ={19}
                    />
                    <Marker coordinate={testMarkerCoord} title="Test Poly" description="Marker test description"
                        icon={require('../assets/images/markers/test.png')} tracksViewChanges={false}/>
                </MapView>
            </View>
          );
    }

    styles = StyleSheet.create({
        container: {
            height: '60%',
            width: '95%',
            borderColor: 'blue',
            borderWidth: 2,
            overflow: 'hidden',
          },
          map: {
            width: '100%',
            height: '100%',
          },
      });
    }
