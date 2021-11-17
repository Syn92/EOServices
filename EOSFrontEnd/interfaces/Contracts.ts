import { IService } from "./Service";
import { User } from "./User";

export interface ContractRequest {
    serviceId: string,
    buyer: string,
    seller: string,
    finalPriceEOS: string,
    accepted: boolean,
    deposit: boolean
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
    confirmedSeller?: boolean,
    confirmedBuyer?: boolean,
    images?: string[],
    creationDate?: Date,
}