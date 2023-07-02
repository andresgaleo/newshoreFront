export interface Journey{
    Origin:string,
    Destination:string,
    Price:number,
    Flight: Flight[]
}

export interface Flight{
    Origin:string,
    Destination:string,
    Price:string,
    Transport:Transport[]
}

export interface Transport{
    FlightCarrier:string,
    FlightNumber:string
}