import { IService } from "./Service";
import { User } from "./User";

export interface ContractRequest {
    _id: string | null,
    roomId: string,
    serviceId: string,
    buyer: string,
    seller: string,
    finalPriceEOS: string,
    accepted: boolean,
    deposit: boolean,
    buyerWalletAccount?: string,
    sellerWalletAccount?:string,
}

export interface Contract {
    _id: string,
    serviceId: string,
    buyer: User,
    seller: User,
    finalPriceEOS: string,
    accepted: boolean,
    serviceDetail: IService,
    deposit?: boolean,
    creationDate?: Date,
}

export interface RequestStatus {
    contract: string;
    roomId: string;
    accepted: boolean;
}