import { LatLng } from "react-native-maps";
import { CustomFeature } from "../utils/Cadastre";

export interface Service {
    title: string;
    description: string;
    material: string;
    priceEOS: number;
    serviceType: string;
    category: string;
    cadastre: CustomFeature;
    markerPos: LatLng;
    owner: string;
    ownerName: string;
    thumbnail: string;
    cadastreId?: string;
    _id: string;
    acceptedBy?: string
}