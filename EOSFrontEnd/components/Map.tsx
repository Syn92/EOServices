import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { LatLng, MapEvent, Marker, Region, UrlTile } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

interface IMarker {
    key: string;
    coordinate: LatLng;
    // title: string;
    // description: string;
    // type: EMarkerType // todo: change marker icon depending on type
}

interface IState {
    initialRegion: Region;
    markers: IMarker[];
}

interface IProps {
    pressable: boolean;
    onPressed?: Function;
}

Geocoder.init("AIzaSyCcPFzHoC-XT8h-3MZt8CfIz5J-w9BeMHA");

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

        if(!props.pressable) {
            //todo: set existing markers from the DB here
        }
    }

    // if pressable, react to the onPress event by adding a marker
    // and calling onPressed with the corresponding address
    private mapPressed(event: MapEvent) {
        if(!this.props.pressable) return;

        const marker: IMarker = {
            key: 'pressedMarker',
            coordinate: event.nativeEvent.coordinate,
        }
        this.addMarker(marker);

        if(this.props.onPressed) {
        Geocoder.from(marker.coordinate).then(json => {
            const address = json.results[0].formatted_address;
            if(this.props.onPressed) this.props.onPressed(address);
        }).catch(error => console.warn(error));
        }
    }

    // add a single marker. do not use if adding more than one at once
    public addMarker(marker: IMarker) {
        const existingIndex = this.state.markers.findIndex(x => x.key == marker.key);
        if(existingIndex != -1) {
            this.state.markers[existingIndex] = marker;
        } else {
            this.state.markers.push(marker);
        }
        this.setState(this.state);
    }

    // customize how the markers are rendered here (icon, etc.)
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
                    <UrlTile urlTemplate='https://api.maptiler.com/maps/streets/{z}/{x}/{y}@2x.png?key=eif7poHbo0Lyr1ArRDWL'
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
