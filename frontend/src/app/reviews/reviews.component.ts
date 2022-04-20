import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  constructor(private _Activatedroute:ActivatedRoute,
    private _http: HttpService,) { }

  id;
  product;
  reviews;

  ngOnInit(): void {
    this.id=this._Activatedroute.snapshot.paramMap.get("id");
    console.log(this.id);
    //prendo tutte le review di questo prodotto
    this._http.ProductDetail(this.id).subscribe((response) => {
      console.log(response.status, response);
      console.log(response["body"]);
      this.product = response["body"]["products"];
      this.reviews = this.product.reviews;
      console.log(this.product, this.reviews);
      
    });
  }

}
