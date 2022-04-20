import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delivery-state',
  templateUrl: './delivery-state.component.html',
  styleUrls: ['./delivery-state.component.scss']
})
export class DeliveryStateComponent implements OnInit {

  delivery
  orderData = []
  state

  constructor(private _Activatedroute:ActivatedRoute, 
    public dialog: MatDialog,
    private router: Router,
    private _http: HttpService) { }

  ngOnInit(): void {
    this._Activatedroute.params.subscribe(params => {
      this.orderData = []
      this.state = params['state']; // (+) converts string 'id' to a number
      //getting all order to be delivered
      this._http.getDelivery().subscribe(data => {
        this.delivery = data["body"]["delivery"]
        this._http.getOrdersForDelivery(this.state).subscribe(data => {
          console.log(data["body"]["order_info"])
          //getting for each order and item od the order it's vendor data
          data["body"]["order_info"].forEach(order => {
            let tmp = []
            order["items"].forEach(item => {
              this._http.getProductByVendorIDandName(item["vendor_id"], item["name"]).subscribe(data => {
                console.log(data);
                //getting vendor data in order to calculate the shop distance to the delivery 
                this._http.getVendorforUser(data["body"]["products"]["shop_name"]).subscribe(data => {
                  let vendor_pos = L.latLng(data["body"]["admin"]["location"]["geometry"]["coordinates"][0], data["body"]["admin"]["location"]["geometry"]["coordinates"][1])
                  var delivery_pos = L.latLng(this.delivery.location.geometry.coordinates[0], this.delivery.location.geometry.coordinates[1]);
                  let dist = parseInt(delivery_pos.distanceTo(vendor_pos), 10)
                  let p = {
                    order: order,
                    vendor: data["body"]["admin"],
                    distance: dist
                  }
                  if(!tmp.includes(data["body"]["admin"]["username"])){
                    tmp.push(data["body"]["admin"]["username"])
                    this.orderData.push(p)
                  }
                  
                });
              });
            });
          });
        });
      })
    });
  }
}
