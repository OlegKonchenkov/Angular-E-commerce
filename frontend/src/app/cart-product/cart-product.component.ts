import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-cart-product',
  templateUrl: './cart-product.component.html',
  styleUrls: ['./cart-product.component.scss']
})
export class CartProductComponent implements OnInit {

  constructor(private _http: HttpService) { }

  @Input() product;
  @Input() index;
  infoProduct;

  @Output()
  removeClicked: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    console.log(this.product);
    console.log(this.index);
    this._http.getProductByVendorIDandName(this.product.vendor_id,this.product.name).subscribe((response) => {
      console.log(response.status);
      console.log(response["body"]);
      this.infoProduct = response["body"]["products"];
      console.log(this.infoProduct);
    });
  }

  remove(){
    console.log(this.infoProduct._id);
    this.removeClicked.emit(this.index);
  }

}
