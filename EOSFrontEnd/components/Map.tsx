import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { Geojson, LatLng, Marker, Region, UrlTile } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import axios, { CancelTokenSource } from 'axios';
import { getCenterOfBounds } from 'geolib';
import { CustomFeature, CustomFeatureColl, getAddress } from '../utils/Cadastre';

interface IMarker {
    key: string;
    coordinate: LatLng;
    // title: string;
    // description: string;
    // type: EMarkerType // todo: change marker icon depending on type
}

interface IProps {
    pressable: boolean;
    onPressed?: ((cadastre: CustomFeature) => any);
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

    const [geoJson, setGeoJson] = useState<CustomFeatureColl>(
        {
            type: "FeatureCollection",
            features: []
        }
    );

    const [selectedGeoJson, setSelectedGeoJson] = useState<CustomFeatureColl>(
        {
            type: "FeatureCollection",
            features: []
        }
    );

    let cancelTokenSource: CancelTokenSource | null;

    if(!props.pressable) {
        //todo: set existing markers from the DB here
    }

    // if pressable, react to the onPress event by adding a marker
    // and calling onPressed with the corresponding address
    function mapPressed(eventTemp: unknown) {
        if(!props.pressable) return;

        // Geocoder.from(marker.coordinate).then(json => {
        //     const address = json.results[0].formatted_address;
        //     if(props.onPressed) props.onPressed(address);
        // }).catch(error => console.warn(error));
        // const features = geoJson.features.filter(x => {
        //     const polygon = (x.geometry as GeoJSON.Polygon)?.coordinates[0] as GeolibInputCoordinates[];
        //     return isPointInPolygon(marker.coordinate, polygon);
        // });
        // console.log(features.flatMap(x => x.properties))
        const event = eventTemp as {feature: CustomFeature, coordinates: LatLng[]}
        if(event && event.feature) {
            setSelectedGeoJson({type: selectedGeoJson.type, features: [event.feature]});
            const marker: IMarker = {
                key: 'pressedMarker',
                coordinate: getCenterOfBounds(event.coordinates),
            }
            setSelectedMarker(marker);
            if(props.onPressed) props.onPressed(event.feature);
            // console.log('vertices: ', (feature.geometry as GeoJSON.Polygon).coordinates[0].length);
        } else {
            setSelectedMarker(null);
            setSelectedGeoJson({type: selectedGeoJson.type, features: []});
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
        cancelTokenSource?.cancel();
        cancelTokenSource = axios.CancelToken.source();
        axios.get('https://eos-marketplace.nn.r.appspot.com/cadastre', { params, cancelToken: cancelTokenSource.token })
            .then(function (response) {
                // handle success
                const features = response.data as CustomFeature[];
                setGeoJson({type: geoJson.type, features: features});
            }).catch(function (error) {
                // handle error
                setGeoJson({type: geoJson.type, features: []});
                if(!axios.isCancel(error)) {
                    console.log(error);
                }
            }).then(function () {
                // always executed
                cancelTokenSource = null
            });
    }

    // add a single marker. do not use if adding more than one at once
    function setSelectedMarker(marker: IMarker | null) {
        const markerKey = "selectedMarker";
        const existingIndex = markers.findIndex(x => x.key == markerKey);
        if(marker) {
            marker.key = markerKey;
            if(existingIndex > -1) {
                markers[existingIndex] = marker;
            } else {
                markers.push(marker);
            }
        } else if(existingIndex > -1) {
            markers.splice(existingIndex, 1);
        }
        setMarkers(markers);
    }

    const testMarkerCoord: LatLng = {
        latitude: 45.5048,
        longitude: -73.6132,
    };
    return (
        <View style={styles.container}>
            <MapView style={styles.map} initialRegion={initialRegion}
                mapType={Platform.OS == "android" ? "none" : "standard"} onRegionChangeComplete={regionChanged}
                pitchEnabled={false} toolbarEnabled={false}>
                <Geojson geojson={selectedGeoJson} strokeColor="black" fillColor="green" strokeWidth={3} zIndex={3}/>
                <Geojson geojson={geoJson} strokeColor="blue" fillColor="rgba(0, 255, 255, 0.2)" strokeWidth={1} zIndex={2}
                tappable={true} onPress={mapPressed}/>
                <UrlTile urlTemplate='https://api.maptiler.com/maps/streets/{z}/{x}/{y}@2x.png?key=eif7poHbo0Lyr1ArRDWL'
                zIndex={1}/>
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
            <Marker key={marker.key} coordinate={marker.coordinate} tracksViewChanges={false} zIndex={5}/>
        )
    });
}

const styles = StyleSheet.create({
    container: {
        // height: '80%',
        width: '100%',
        borderRadius: 15,
        overflow: 'hidden',
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
