import { Service } from "./Service";

export interface ServiceInfo {
    category: string,
    title: string,
    owner: string,
    price: number,
    position: string
}

export interface RequestInfo {
    thumbnail: string,
    title: string,
    isUnique: boolean,
    requestUser?: string,
    serviceOwner? : string
}

export interface ServiceRequest {
    serviceID: string,
    reqDescription: string,
    requestUserUID: string,
    serviceOwner: string
}


export interface ServiceData {
    open: Array<Object>,
    inProgress: Array<Object>,
    completed: Array<Object>,
}

export interface Request {
    _id: string,
    reqDescription: string,
    serviceID: string,
    serviceOwner: string,
    requestUserUID: string,
    serviceDetail: Service,
    requestUserName: string
}

export interface newDeal{
    buyer:string,
    seller:string,
    amount:number,
    description:string,
}
export interface Deal extends newDeal{
    dealId:string,
}

export interface RequestData {
    outgoing: Array<Request>,
    incoming: Array<Request>,
}


export enum ServiceStatus {
    OPEN = 'open',
    IN_PROGRESS = 'inProgress',
    COMPLETED = 'completed'
}

export enum ServiceIndex {
    open = 0,
    inProgress = 1,
    completed = 2
}

export enum RequestIndex {
    incoming = 0,
    outgoing = 1,
}
