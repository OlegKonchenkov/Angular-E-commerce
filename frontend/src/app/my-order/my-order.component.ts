import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { PRODUCTS } from '../mock-products';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss']
})
export class MyOrderComponent implements OnInit {

  products = PRODUCTS;
  orders;

  constructor(private _http: HttpService) { }

  ngOnInit(): void {
    this._http.getOrders().subscribe(response => {
      console.log(response.status);
      
      this.orders = response["body"]["order_info"]
      console.log(this.orders);
    })
  }

}
