import { IService } from "./Service";
import { User } from "./User";

export interface ContractRequest {
    _id: string | null,
    roomId: string,
    serviceId: string,
    buyer: string,
    seller: string,
    finalPriceEOS: string,
    accepted: boolean
}

export interface Contract {
    _id: string,
    serviceId: string,
    buyer: User,
    seller: User,
    finalPriceEOS: string,
    accepted: boolean,
    serviceDetail: IService
}

export interface RequestStatus {
    contract: string;
    roomId: string;
    accepted: boolean;
}