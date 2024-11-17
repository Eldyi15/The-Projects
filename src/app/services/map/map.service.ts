import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { LocationService } from '../location/location.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map:any;
  constructor(private locator: LocationService) { }
  createMap() {
    return new Promise((resolve,reject) => {
      this.locator.getCurrentLocation().then((position: any) =>{
        const {latitude, longitude} = position.coords;
        const latlng = L.latLng(latitude, longitude);
        const map = L.map('map').setView(latlng,19);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          // attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
      this.map = map;
      resolve(map)
      });
    })
  }
}
