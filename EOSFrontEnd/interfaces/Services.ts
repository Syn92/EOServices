export interface ServiceInfo {
    category: string,
    title: string,
    owner: string,
    price: number,
    position: string
}

export interface ServiceRequest {
    serviceID: string,
    reqDescription: string,
    requestUserUID: string,
    serviceOwner: string
}

export enum ServiceStatus {
    OPEN = 'open',
    IN_PROGRESS = 'inProgress',
    COMPLETED = 'completed'
}