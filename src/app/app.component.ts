import { Component, Inject,  LOCALE_ID } from '@angular/core';
import { Journey } from './ijourney';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { formatNumber } from '@angular/common';

interface Monedas {
  name:string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {

  constructor(private http:HttpClient, @Inject(LOCALE_ID) public locale: string){}
  title = 'FrontFlights';

  vuelo= {
    Origin:"",
    Destination: ""
  }

  monedas: Monedas[] = [
    {name:"USD"},
    { name:"COP"}, 
    {name:"EUR"}
  ]

  journey:any=[]


  totalPrice:string = "";
  Buscar(){
    if(this.vuelo.Origin==this.vuelo.Destination){
      alert("No pueden ser igual el origen y el destino");
      this.vuelo.Origin="";
      this.vuelo.Destination="";
    }else{
      if(this.vuelo.Origin.length>3 || this.vuelo.Destination.length>3){
        alert("La cantidad de caracteres por origen o destino es de 3!");
        this.vuelo.Origin="";
        this.vuelo.Destination="";
      }else{
        const httpOptions = {
            headers: { 'Content-Type': 'application/json' },
            params: this.vuelo
          };
        this.http.get<any>('https://localhost:7059/Flights/find/one',httpOptions
      ).subscribe(data=>{
        this.journey = <any>(data.journey);
        for(let flight of data.journey.flight){
          flight.originalPrice = flight.price;
        }
        this.totalPrice = formatNumber(this.journey.price,this.locale);
      });        
      }
    }
  }

  Mayusculas(input:string){
    if(input=="origen"){
      this.vuelo.Origin = this.vuelo.Origin.toUpperCase();
    }else{
      this.vuelo.Destination = this.vuelo.Destination.toUpperCase();
    }
  }

  cambioMoneda(monedaNueva:string){
    this.journey.price = 0;
    for(let data of this.journey.flight){
      this.http.get<any>('https://localhost:7059/Flights/currency/USD/'+monedaNueva+'/'+data.originalPrice)
      .subscribe(response=>{
        data.price = formatNumber(response.price,this.locale);
        this.journey.price += response.price;
        this.totalPrice = formatNumber(this.journey.price,this.locale);
      });
    }
  }
}
