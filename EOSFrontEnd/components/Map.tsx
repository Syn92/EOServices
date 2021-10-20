import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { Geojson, LatLng, MapEvent, Marker, Region, UrlTile } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import axios from 'axios';
import { isPointInPolygon } from 'geolib';
import { GeolibInputCoordinates } from 'geolib/es/types';

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

interface IFeatureProperties {
    ID_UEV: string,
    CIVIQUE_DEBUT: string,
    NOM_RUE: string,
    MUNICIPALITE: string,
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

    const [geoJson, setGeoJson] = useState<GeoJSON.FeatureCollection<GeoJSON.Geometry, IFeatureProperties>>(
        {
            type: "FeatureCollection",
            features: []
        }
    );

    const [selectedGeoJson, setSelectedGeoJson] = useState<GeoJSON.FeatureCollection>(
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

        if(props.onPressed) {
            // Geocoder.from(marker.coordinate).then(json => {
            //     const address = json.results[0].formatted_address;
            //     if(props.onPressed) props.onPressed(address);
            // }).catch(error => console.warn(error));
            const feature = geoJson.features.find(x => {
                const polygon = (x.geometry as GeoJSON.Polygon)?.coordinates[0] as GeolibInputCoordinates[];
                if(!polygon) return false;
                return isPointInPolygon(event.nativeEvent.coordinate, polygon);
            });
            if(feature) {
                const marker: IMarker = {
                    key: 'pressedMarker',
                    coordinate: event.nativeEvent.coordinate,
                }
                setSelectedMarker(marker);
                setSelectedGeoJson({type: selectedGeoJson.type, features: [feature]});
                if(props.onPressed) props.onPressed(feature.properties.CIVIQUE_DEBUT + " " + feature.properties.NOM_RUE)
                console.log('vertices: ', (feature.geometry as GeoJSON.Polygon).coordinates[0].length);
            } else {
                setSelectedMarker(null);
                setSelectedGeoJson({type: selectedGeoJson.type, features: []});
            }
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
        axios.get('http://10.200.12.162:4000/cadastre', { params },)
            .then(function (response) {
                // handle success
                const features = response.data as GeoJSON.Feature<GeoJSON.Geometry, IFeatureProperties>[];
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
            <MapView style={styles.map} initialRegion={initialRegion} onPress={mapPressed}
                mapType={Platform.OS == "android" ? "none" : "standard"} onRegionChangeComplete={regionChanged}>
                <Geojson geojson={selectedGeoJson} strokeColor="black" fillColor="green" strokeWidth={2} zIndex={3}></Geojson>
                <Geojson geojson={geoJson} strokeColor="blue" fillColor="rgba(0, 255, 255, 0.2)" strokeWidth={1} zIndex={2}></Geojson>
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
            <Marker key={marker.key} coordinate={marker.coordinate} tracksViewChanges={false} zIndex={5}/>
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
