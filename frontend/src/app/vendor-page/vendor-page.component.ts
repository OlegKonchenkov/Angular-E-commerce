import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-vendor-page',
  templateUrl: './vendor-page.component.html',
  styleUrls: ['./vendor-page.component.scss']
})
export class VendorPageComponent implements OnInit {

  //Variables to Set Title and Subtitle
  title = 'Shop Info';
  subtitle = 'Products List';

  //Variables to display vendor info
  shop_name;
  vendorShop;
  productData;

  displayProducts = false;
  okFollow = false;
  errorFollow = false;
  removeFollow = false;
  displayFollow = false;
  displayUnFollow = false;

  constructor(private _http: HttpService, private _Activatedroute: ActivatedRoute) { }

  ngOnInit(): void {
    this._Activatedroute.params.subscribe(params => {
      this.shop_name = params['shop_name'];
    });
    this._http.getVendorforUser(this.shop_name).subscribe((data) => {
      this.vendorShop = data["body"]["admin"];
      console.log(this.vendorShop)
    });
    this._http.getProductofVendor(this.shop_name).subscribe((data) => {
      this.productData = data["body"]["products"];
    });
    this._http.checkFollower(this.shop_name).subscribe((data) => {
      if(data.status == 200 && data['body']['error']==undefined){
        if (!data['body']['is_follower']) {
          this.displayFollow = true;
        } else if (data['body']['is_follower']) {
          this.displayUnFollow = true;
        }
      }
    });
  }

  //Open all products list of shop
  openProducts() {
    this.displayProducts = true;
  }

  //Method that follow a shop
  addFollow() {
    this._http.addFollower({shop_name: this.shop_name}).subscribe((data) => {
      if(data.status == 200 && data['body']['error']==undefined){
        this.okFollow = true;
        this.errorFollow = false;
        this.removeFollow = false;
        this.displayUnFollow = true;
        this.displayFollow = false;
      } else {
        this.okFollow = false;
        this.errorFollow = true;
        this.removeFollow = false;
        this.displayUnFollow = false;
        this.displayFollow = true;
      }
      setTimeout(() => {
        this.okFollow = false;
        this.errorFollow = false;
        this.removeFollow = false;
      }, 2000);
    });
  }

  //Method that remove follow to shop
  removeFollower() {
    this._http.removeFollower(this.shop_name).subscribe((data) => {
      if(data.status == 200 && data['body']['error']==undefined){
        this.removeFollow = true;
        this.errorFollow = false;
        this.okFollow = false;
        this.displayUnFollow = false;
        this.displayFollow = true;
      } else {
        this.errorFollow = true;
        this.removeFollow = false;
        this.okFollow = false;
        this.displayUnFollow = true;
        this.displayFollow = false;
      }
      setTimeout(() => {
        this.errorFollow = false;
        this.removeFollow = false;
        this.okFollow = false;
      }, 2000);
    });
  }
}