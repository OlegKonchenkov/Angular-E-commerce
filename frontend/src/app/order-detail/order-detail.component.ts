import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  id;
  order;
  products;
  shippingData;
  paymentData;
  delivery;
  infoProduct;
  

  constructor(private _Activatedroute:ActivatedRoute,
    private _http: HttpService) { }


  ngOnInit(): void {
    this.id=this._Activatedroute.snapshot.paramMap.get("id");
    console.log(this.id);
    this._http.orderDetail(this.id).subscribe(response => {
      console.log(response.status);
      console.log(response["body"]);
      this.order = response["body"]["order_info"];
      this.products = this.order.items;
      this.shippingData = this.order.shippingData;
      this.paymentData = this.order.payment;
      this.delivery = this.order.delivery;
      console.log(this.products, this.shippingData, this.paymentData, this.delivery, this.order);
      this._http.getProductByVendorIDandName(this.products.vendor_id,this.products.name).subscribe((response) => {
        console.log(response.status);
        console.log(response["body"]);
        this.infoProduct = response["body"]["products"];
        console.log(this.infoProduct);
      });
    });
    

  }


  

}
