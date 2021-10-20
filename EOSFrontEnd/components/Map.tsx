import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { Geojson, LatLng, MapEvent, Marker, Region, UrlTile } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import axios from 'axios';

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

    const [geoJson, setGeoJson] = useState<GeoJSON.FeatureCollection>(
        {
            type: "FeatureCollection",
            features: []
        }
    );

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
        //todo: replace with checking on the cadastre foreach
        }
    }

    // refresh the geojson when region is done changing
    async function regionChanged(region: Region) {
        const minZoom = 0.0035;
        if(region.latitudeDelta > minZoom && region.longitudeDelta > minZoom) {
            setGeoJson({type: geoJson.type, features: []});
            return;
        }
        const params = {
            latitude: region.latitude,
            longitude: region.longitude
        }
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }
        axios.get('http://10.200.12.162:4000/cadastre', { params, headers},)
            .then(function (response) {
                // handle success
                const features = response.data as GeoJSON.Feature[];
                setGeoJson({type: geoJson.type, features: features});
            }).catch(function (error) {
                // handle error
                console.log(error);
                setGeoJson({type: geoJson.type, features: []});
            }).then(function () {
                // always executed
            });
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
                mapType={Platform.OS == "android" ? "none" : "standard"} onRegionChangeComplete={regionChanged}>
                <Geojson geojson={geoJson} strokeColor="blue" fillColor="rgba(0, 255, 255, 0.2)" strokeWidth={2} zIndex={2}></Geojson>
                <UrlTile urlTemplate='https://api.maptiler.com/maps/streets/{z}/{x}/{y}@2x.png?key=eif7poHbo0Lyr1ArRDWL'
                    maximumZ={19} zIndex={1}
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

function geoJsonFeatureToAddress(feature: GeoJSON.Feature): string {
    return "temp";
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
