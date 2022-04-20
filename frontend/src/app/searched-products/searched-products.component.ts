import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-searched-products',
  templateUrl: './searched-products.component.html',
  styleUrls: ['./searched-products.component.scss']
})
export class SearchedProductsComponent implements OnInit {

  constructor(private _Activatedroute:ActivatedRoute,
    private _http: HttpService) { }

  name;
  products= [];

  ngOnInit(): void {
    this.name=this._Activatedroute.snapshot.paramMap.get("name");
    console.log(this.name);
    this._http.searchProduct(this.name).subscribe((response) =>{
      console.log(response.status);
      console.log(response["body"]);
      this.products = response["body"]["products"];
      console.log(this.products);
    });
  }

}
