import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Region, UrlTile } from 'react-native-maps';

interface IState {
    region: Region;
}

export default class Map extends React.Component<{}, IState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
        };
    }

    onRegionChange(region: Region) {
        // this.setState({ region });
    }

    render() {
        return (
            <View style={this.styles.container}>
                <MapView style={this.styles.map} region={this.state.region} onRegionChange={this.onRegionChange.bind(this)}>
                    <UrlTile urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maximumZ={19}
                    />
                </MapView>
            </View>
          );
    }

    styles = StyleSheet.create({
        container: {
            // flex: 1,
            // alignItems: 'center',
            // justifyContent: 'center',
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
