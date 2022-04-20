import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-offers-of-the-moment-page',
  templateUrl: './offers-of-the-moment-page.component.html',
  styleUrls: ['./offers-of-the-moment-page.component.scss']
})
export class OffersOfTheMomentPageComponent implements OnInit {

  constructor(private _http: HttpService) { }

  products = [];
  title = 'Offerte del Momento';

  ngOnInit(): void {
    this._http.SalesProducts().subscribe((response) => {
      console.log(response["body"]);
      this.products = response["body"]["products"];
    });
  }

}
