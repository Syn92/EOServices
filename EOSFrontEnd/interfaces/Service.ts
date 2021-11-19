import { LatLng } from "react-native-maps";
import { FilterCat } from "../constants/Utils";
import { CustomFeature } from "../utils/Cadastre";

export interface IService {
    title: string;
    description: string;
    material: string;
    priceEOS: number;
    serviceType: 'Offering' | 'Looking For';
    category: FilterCat;
    cadastre: CustomFeature;
    markerPos: LatLng;
    owner: string;
    ownerName: string;
    thumbnail: string;
    cadastreId?: string;
    _id: string;
    acceptedBy?: string
    images: string[];
}
