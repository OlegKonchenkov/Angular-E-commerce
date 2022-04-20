import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delivery-detail',
  templateUrl: './delivery-detail.component.html',
  styleUrls: ['./delivery-detail.component.scss']
})
export class DeliveryDetailComponent implements OnInit {

  _id
  vendor_id 
  shop_name
  state
  distance
  order
  vendor
  vendor_position
  delivery_position  
  delivery
  routing
  items = []

  constructor(private _Activatedroute:ActivatedRoute, 
    public dialog: MatDialog,
    private router: Router,
    private _http: HttpService) { }

  ngOnInit(): void {
    //map creation
    let myMap = L.map('map-delivery-detail').setView([44.133331, 12.233333], 8);
    
    //map main layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    this._id = this._Activatedroute.snapshot.paramMap.get("id");
    this.vendor_id = this._Activatedroute.snapshot.paramMap.get("vendor_id");
    this.shop_name = this._Activatedroute.snapshot.paramMap.get("shop_name");
    this.state = this._Activatedroute.snapshot.paramMap.get("state");
    console.log("id: " + this._id + "shop_name: " + this.shop_name + "vendor_id: " + this.vendor_id)

    this._http.orderDetail(this._id).subscribe(data => {
      console.log(data)
      this.order = data["body"]["order_info"]
      this.order.items.forEach(item => {
        if(item.vendor_id == this.vendor_id){
          this.items.push(item)
        }
        console.log(this.items)
      })
    })

    this._http.getDelivery().subscribe(data => {
      this.delivery = data["body"]["delivery"]
      this._http.getVendorforUser(this.shop_name).subscribe(data => {
        this.vendor = data["body"]["admin"]
        this.vendor_position = L.latLng(data["body"]["admin"]["location"]["geometry"]["coordinates"][0], data["body"]["admin"]["location"]["geometry"]["coordinates"][1])
        this.delivery_position = L.latLng(this.delivery.location.geometry.coordinates[0], this.delivery.location.geometry.coordinates[1]);
        this.distance = parseInt(this.delivery_position.distanceTo(this.vendor_position), 10)

        L.marker(this.delivery_position).addTo(myMap)
              .bindPopup("Questa è la tua posizione").openPopup();
      
        this.routing = L.Routing.control({
          lineOptions: {styles: [{color: '#242c81', weight: 7}]},
          waypoints: [
            this.vendor_position,
            this.delivery_position
          ],
          routeWhileDragging: true,
          collapsible: true
        })
        this.routing.addTo(myMap);
      })
    })

    setInterval(locate, 15000);

    // wrap map.locate in a function    
    function locate() {
      myMap.locate({setView: true, maxZoom: 8});
    }
    //finds the users current location if the GPS is avaliable
    myMap.on('locationfound', e =>{
      this.delivery_position = e.latlng
      this.distance = parseInt(e.latlng.distanceTo(this.vendor_position), 10)
      myMap.removeControl(this.routing)
      this.routing = L.Routing.control({
        lineOptions: {styles: [{color: '#242c81', weight: 7}]},
        waypoints: [
          this.vendor_position,
          this.delivery_position
        ],
        routeWhileDragging: true,
        collapsible: true
      })
      this.routing.addTo(myMap);

      var new_coordinates = {
        new_coordinates : e.latlng
      };
      this._http.ChangeDeliveryPosition(new_coordinates).subscribe(data => {
        console.log(data);
      });

      L.marker(e.latlng).addTo(myMap)
        .bindPopup("Questa è la tua posizione").openPopup();
    });

    //Error message if GPS is unavaliable 
    myMap.on('locationerror', e => {
      alert(e.message);
    });

    //reading map click event
    var popup = L.popup();

    myMap.on('click', e => {
      this.delivery_position = e.latlng
      this.distance = parseInt(e.latlng.distanceTo(this.vendor_position), 10)
      myMap.removeControl(this.routing)
      this.routing = L.Routing.control({
        lineOptions: {styles: [{color: '#242c81', weight: 7}]},
        waypoints: [
          this.vendor_position,
          this.delivery_position
        ],
        routeWhileDragging: true,
        collapsible: true
      })
      this.routing.addTo(myMap);
      var new_coordinates = {
        new_coordinates : e.latlng
      };

      popup
      .setLatLng(e.latlng)
      .setContent("Hai cliccatto su questo punto della mappa con coordinate: " + e.latlng.toString())
      .openOn(myMap);     

      var new_coordinates = {
        new_coordinates : e.latlng
      };
      this._http.ChangeDeliveryPosition(new_coordinates).subscribe(data => {
        console.log(data);
      });
    });
  }

  takeOrder(){
    let json = {
      _id: this.order._id,
      delivery_id: this.delivery._id,
      name: this.delivery.first_name,
      orderStatus: "Spedito"
    }
    this._http.setDelivery(json).subscribe(response => {
      if(response.status == 200){
        const dialogRef = this.dialog.open(DialogComponent, {
          data: "Lo stato dell'ordine è stato aggiornato"
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result == true){
            this.router.navigate([''])
            .then(() => {
              window.location.reload();
            });
          }
        })
      } 
    });
  }

  changeDeliveryState(order_id){
    let json = {
      _id: order_id,
      delivery_id: this.delivery._id,
      name: this.delivery.first_name,
      orderStatus: "Consegnato"
    }
    this._http.setDelivery(json).subscribe(response => {
      if(response.status == 200){
        const dialogRef = this.dialog.open(DialogComponent, {
          data: "Lo stato dell'ordine è stato aggiornato"
        });
      } 
    });
  }
}
