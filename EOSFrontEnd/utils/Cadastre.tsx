export type CustomFeatureColl = GeoJSON.FeatureCollection<GeoJSON.Geometry, IFeatureProperties>
export type CustomFeature = GeoJSON.Feature<GeoJSON.Geometry, IFeatureProperties>

export interface IFeatureProperties {
    ID_UEV: string,
    CIVIQUE_DEBUT: string,
    NOM_RUE: string,
    MUNICIPALITE: string,
}

export function getAddress(feature: CustomFeature): string {
    return feature.properties.CIVIQUE_DEBUT + " " + feature.properties.NOM_RUE;
}