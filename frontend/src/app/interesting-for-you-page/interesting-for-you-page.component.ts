import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-interesting-for-you-page',
  templateUrl: './interesting-for-you-page.component.html',
  styleUrls: ['./interesting-for-you-page.component.scss']
})
export class InterestingForYouPageComponent implements OnInit {

  constructor(private _http: HttpService) { }

  products = [];
  title = 'Prodotti Interessanti per Te';

  ngOnInit(): void {
    this._http.InterestProducts().subscribe((response) => {
      console.log(response["body"]);
      this.products = response["body"]["products"];
    });
  }

}
