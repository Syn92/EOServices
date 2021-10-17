import React, { useState } from 'react';
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

interface IProps {
    pressable: boolean;
    onPressed?: Function;
}

Geocoder.init("AIzaSyCcPFzHoC-XT8h-3MZt8CfIz5J-w9BeMHA");

const initialRegion: Region = {
    latitude: 45.5017,
    longitude: -73.5673,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

export default function Map(props: IProps) {
    const [markers, setMarkers] = useState<IMarker[]>([]);

    if(!props.pressable) {
        //todo: set existing markers from the DB here
    }

    // if pressable, react to the onPress event by adding a marker
    // and calling onPressed with the corresponding address
    function mapPressed(event: MapEvent) {
        if(!props.pressable) return;

        const marker: IMarker = {
            key: 'pressedMarker',
            coordinate: event.nativeEvent.coordinate,
        }
        addMarker(marker);

        if(props.onPressed) {
        Geocoder.from(marker.coordinate).then(json => {
            const address = json.results[0].formatted_address;
            if(props.onPressed) props.onPressed(address);
        }).catch(error => console.warn(error));
        }
    }

    // add a single marker. do not use if adding more than one at once
    function addMarker(marker: IMarker) {
        const existingIndex = markers.findIndex(x => x.key == marker.key);
        if(existingIndex != -1) {
            markers[existingIndex] = marker;
        } else {
            markers.push(marker);
        }
        setMarkers(markers);
    }

    const testMarkerCoord: LatLng = {
        latitude: 45.5048,
        longitude: -73.6132,
    };
    return (
        <View style={styles.container}>
            <MapView style={styles.map} initialRegion={initialRegion} onPress={mapPressed}
                mapType={Platform.OS == "android" ? "none" : "standard"}>
                <UrlTile urlTemplate='https://api.maptiler.com/maps/streets/{z}/{x}/{y}@2x.png?key=eif7poHbo0Lyr1ArRDWL'
                    maximumZ={19}
                />
                <Marker key="example" coordinate={testMarkerCoord} title="Test Poly" description="Marker test description"
                    icon={require('../assets/images/markers/test.png')} tracksViewChanges={false}/>
                {markers.length > 0 ? renderMarkers(markers) : null}
            </MapView>
        </View>
    );
};

// customize how the markers are rendered here (icon, etc.)
function renderMarkers(markers: IMarker[]): JSX.Element[] {
    return markers.map((marker) => {
        return (
            <Marker key={marker.key} coordinate={marker.coordinate} tracksViewChanges={false}/>
        )
    });
}

const styles = StyleSheet.create({
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
