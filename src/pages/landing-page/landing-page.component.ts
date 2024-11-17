import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/services/map/map.service';
import * as L from 'leaflet';
import { LocationService } from 'src/app/services/location/location.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddBoundariesModalComponent } from 'src/app/shared/add-boundaries-modal/add-boundaries-modal.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  map:any;
  myIcon = L.icon({
    iconUrl: './../../assets/images/meIcon.gif',
  });
  currentLoc:any;
  isAddToggleEnabled = false;
  boundaries:any = [];
  isLoaded = false;
  boundariesForm = new FormGroup({
    fullName: new FormControl('',[Validators.required]),
    marker1: new FormControl({value:'', disabled:true},[Validators.required]),
    marker2: new FormControl({value:'', disabled:true},[Validators.required]),
    marker3: new FormControl({value:'', disabled:true},[Validators.required]),
    marker4: new FormControl({value:'', disabled:true},[Validators.required]),

  })
  constructor(
    private mapService: MapService,
    private locator: LocationService,
    private diagRef: MatDialog
  ) {
  }
  ngOnInit(): void {
    this.createMap();
    const formNames = ['fullName', 'marker1', 'marker2', 'marker3', 'marker4'];
    formNames.forEach((name, index) => {
      this.boundariesForm.get(name)?.valueChanges.subscribe(() =>{
        this.checkValidators(name, index);
      })
    })    
    
  }
  createMap() {
    this.locator.getCurrentLocation().then((position) => {
      this.currentLoc = position;
      return this.mapService.createMap()
    }).then(map =>{
      const {latitude, longitude} = this.currentLoc.coords;
      this.map = map;
      L.marker(L.latLng(latitude, longitude), { icon: this.myIcon })
      .addTo(this.map);

      this.map.on('zoomend', () => {
        var newzoom = '' + (2*(this.map.getZoom())) +'px';
        const iconElem = document.getElementsByClassName('leaflet-marker-icon')[0];
        iconElem.setAttribute('height' , newzoom);
        iconElem.setAttribute('width',newzoom);
      })
      this.isLoaded = true;
    })
  }
  addMapClickListener() {
    const formNames = ['marker1', 'marker2', 'marker3', 'marker4'];
    this.isAddToggleEnabled = true;
    this.map.on('click', (event:any) => {
    let exit = false;
        formNames.forEach((name, index) => {
          if (!this.boundariesForm.get(name)?.valid && !exit) {
            let {lat,lng} = event.latlng 
            this.boundariesForm.get(name)?.setValue(`${lat}, ${lng}`);
            
            exit = true;
          }
          if (this.boundariesForm.get(name)?.valid && formNames.length === index + 1) {
            this.stopMapClickListener();
            this.addBoundaries();
          }
        })
    })
  }
  stopMapClickListener() {
    this.map.off('click')
  }
  openDialog() {
    this.diagRef.open(AddBoundariesModalComponent, {
      height: '400px',
      width: '600px',
    })
  }
  checkValidators(name: string, index: number) {
    const formNames = ['fullName', 'marker1', 'marker2', 'marker3', 'marker4'];
        if (this.boundariesForm.get(name)?.valid) {
          this.boundariesForm.get(formNames[index + 1])?.enable();
        } else {
          this.boundariesForm.get(formNames[index + 1])?.disable();
        }
  }
  addBoundaries() {
    let val = this.boundariesForm.getRawValue();
    let boundary:any = {
        fullName: val.fullName,
        latlngs: [val.marker1?.split(','), val.marker2?.split(','), val.marker3?.split(','), val.marker4?.split(',')]
      }
    this.boundaries.push(boundary);
    L.polygon(boundary.latlngs, {color: 'red'}).addTo(this.map);
  }
}
