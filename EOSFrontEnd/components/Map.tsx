import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { LatLng, MapEvent, Marker, Region, UrlTile } from 'react-native-maps';

interface IMarker {
    key: string;
    coordinate: LatLng;
    // title: string;
    // description: string;
}

interface IState {
    initialRegion: Region;
    markers: IMarker[];
}

interface IProps {
    pressable: boolean;
    onPressed?: Function | null;
}

export default class Map extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            initialRegion: {
                latitude: 45.5017,
                longitude: -73.5673,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            markers: []
        };
    }

    private mapPressed(event: MapEvent) {
        if(!this.props.pressable) return;

        const marker: IMarker = {
            key: 'pressedMarker',
            coordinate: event.nativeEvent.coordinate,
        }
        this.addMarker(marker);
    }

    public addMarker(marker: IMarker) {
        const existingIndex = this.state.markers.findIndex(x => x.key == marker.key);
        if(existingIndex != -1) {
            this.state.markers[existingIndex] = marker;
        } else {
            this.state.markers.push(marker);
        }
        this.setState(this.state);
    }

    private renderMarkers() {
        return this.state.markers.map((marker) => {
            return (
              <Marker key={marker.key} coordinate={marker.coordinate} tracksViewChanges={false}/>
            )
          });
    }

    render() {
        const testMarkerCoord: LatLng = {
            latitude: 45.5048,
            longitude: -73.6132,
        };
        return (
            <View style={this.styles.container}>
                <MapView style={this.styles.map} initialRegion={this.state.initialRegion} onPress={this.mapPressed.bind(this)}
                    mapType={Platform.OS == "android" ? "none" : "standard"}>
                    <UrlTile urlTemplate='http://c.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'
                        maximumZ={19}
                    />
                    <Marker key="example" coordinate={testMarkerCoord} title="Test Poly" description="Marker test description"
                        icon={require('../assets/images/markers/test.png')} tracksViewChanges={false}/>
                    {this.state.markers.length > 0 ? this.renderMarkers() : null}
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
