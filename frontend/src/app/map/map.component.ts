import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpService } from '../http.service';
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/images/marker-icon-2x.png";
import 'leaflet-routing-machine';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {
  @Input() state;
  @Input() location
  routing
  deliveryPosition
  userType
  constructor(private _http: HttpService) { }

  ngOnInit(): void {
    //map creation
    let myMap = L.map('map').setView([44.133331, 12.233333], 8);
    
    
    //map main layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    this._http.GetUserByID().subscribe(data => {
      this.userType = data["profile_type"]
      if(this.userType == "Delivery Guy"){
        // call locate every 3 seconds... forever
        setInterval(locate, 15000);

        //reading map click event
        var popup = L.popup();

        myMap.on('click', e => {
          console.log(this.deliveryPosition + " aaa " + e.latlng)
          if(this.routing != undefined ){
            myMap.removeControl(this.routing)
          }
          this.routing = L.Routing.control({
            lineOptions: {styles: [{color: '#242c81', weight: 7}]},
            waypoints: [
              e.latlng,
              this.deliveryPosition
            ],
            routeWhileDragging: true,
            collapsible: true
          })
          this.routing.addTo(myMap);
        });

        //        
        var orderData
        var adminData = []
        var delivery
        
        this._http.getDelivery().subscribe(data => {
          delivery = data["body"]["delivery"]
          this.deliveryPosition =  L.latLng(delivery.location.geometry.coordinates[0], delivery.location.geometry.coordinates[1]);
          L.marker(this.deliveryPosition).addTo(myMap)
                    .bindPopup("Questa è la tua posizione").openPopup();
          this._http.getOrdersForDelivery(this.state).subscribe(data => {
            console.log(data["body"]["order_info"])
            orderData = data["body"]["order_info"]
            console.log(orderData)
            orderData.forEach(order => {
              order["items"].forEach(item => {
                this._http.getProductByVendorIDandName(item["vendor_id"], item["name"]).subscribe(data => {
                  console.log(data);
                  this._http.getVendorforUser(data["body"]["products"]["shop_name"]).subscribe(data => {
                    console.log(data);
                    console.log(data["body"]["admin"]["location"])
                    adminData.push(data["body"]["admin"])
                    var vendor_pos = L.latLng(data["body"]["admin"]["location"]["geometry"]["coordinates"][0], data["body"]["admin"]["location"]["geometry"]["coordinates"][1]);
                    L.marker(vendor_pos).addTo(myMap)
                    .bindPopup("La distanza dal negozio "+ data["body"]["admin"]["shop_name"] + " è circa: " + parseInt(this.deliveryPosition.distanceTo(vendor_pos), 10) + 
                    " m \n per maggiori dettagli clicca sulla mappa vicino al punto desiderato" ).openPopup();
                  });
                });
              });
            });
          });
        })
      } else if(this.userType == "Admin"){
        //reading map click event
        this._http.getVendorUser().subscribe(data => {    
          var vendor_pos = L.latLng(data["admin"]["location"]["geometry"]["coordinates"][0], data["admin"]["location"]["geometry"]["coordinates"][1]);
          L.marker(vendor_pos).addTo(myMap)
          .bindPopup("Questa è la posizione del tuo negozio").openPopup();
        });

        var popup = L.popup();

        myMap.on('click', e => {
          popup
          .setLatLng(e.latlng)
          .setContent("Hai cliccatto su questo punto della mappa con coordinate:" + e.latlng.toString())
          .openOn(myMap);     

          var new_coordinates = {
            new_coordinates : e.latlng
          };
          this._http.ChangeAdminPosition(new_coordinates).subscribe(data => {
            console.log(data);
          });
        });
      }else if(this.userType == "Customer"){
        var vendor_pos = L.latLng(this.location.geometry.coordinates[0], this.location.geometry.coordinates[1]);
        locate()
        L.marker(vendor_pos).addTo(myMap)
        .bindPopup("Questa è la posizione del negozio del venditore").openPopup();
      }
    })
    // wrap map.locate in a function    
    function locate() {
      myMap.locate({setView: false, maxZoom: 8});
    }
    //finds the users current location if the GPS is avaliable
    myMap.on('locationfound', e =>{
      if(this.userType == "Customer"){
        if(this.routing != undefined ){
          myMap.removeControl(this.routing)
        }
        this.routing = L.Routing.control({
          lineOptions: {styles: [{color: '#242c81', weight: 7}]},
          waypoints: [
            e.latlng,
            L.latLng(this.location.geometry.coordinates[0], this.location.geometry.coordinates[1])
          ],
          routeWhileDragging: true,
          collapsible: true
        })
        this.routing.addTo(myMap);
      }else {
        var new_coordinates = {
          new_coordinates : e.latlng
        };
        this._http.ChangeDeliveryPosition(new_coordinates).subscribe(data => {
          console.log(data);
        });
      }

      L.marker(e.latlng).addTo(myMap)
        .bindPopup("Questa è la tua posizione").openPopup();
    });

    //Error message if GPS is unavaliable 
    myMap.on('locationerror', e => {
      alert(e.message);
    });
    
/*
    //geojson example var
    var geojsonFeature = {
      "type": "Feature",
      "properties": {
          "name": "Coors Field",
          "amenity": "Baseball Stadium",
          "popupContent": "This is where the Rockies play!"
      },
      "geometry": {
          "type": "Point",
          "coordinates": [12.233333, 44.133331]
      }
    };
    L.geoJSON(geojsonFeature).addTo(myMap);
    */
  }
}
