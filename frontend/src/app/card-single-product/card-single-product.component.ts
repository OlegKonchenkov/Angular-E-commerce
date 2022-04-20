import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-single-product',
  templateUrl: './card-single-product.component.html',
  styleUrls: ['./card-single-product.component.scss']
})
export class CardSingleProductComponent implements OnInit {

  @Input() name;
  @Input() price;
  @Input() sale;
  @Input() quantity;  
  @Input() availability;
  @Input() rating;
  @Input() product_picture;
  @Input() product;


  constructor() { }

  ngOnInit(): void {
    console.log(this.product);
  }

}
