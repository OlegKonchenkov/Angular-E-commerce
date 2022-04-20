import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  constructor() { }

  @Input() order;
  products: Array<any> = [];
  date: string = "";

  ngOnInit(): void {
    console.log(this.order);
    this.date = this.order.date;
    this.date = this.date.substring(0,10);
    this.products = this.order.items;
    console.log(this.products.length);
    console.log(this.order.items.length);

  }

}
