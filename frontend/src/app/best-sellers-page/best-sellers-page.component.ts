import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-best-sellers-page',
  templateUrl: './best-sellers-page.component.html',
  styleUrls: ['./best-sellers-page.component.scss']
})
export class BestSellersPageComponent implements OnInit {

  constructor(private _http: HttpService) { }

  products = [];
  title = 'Prodotti più Venduti';

  ngOnInit(): void {
    this._http.MostSold().subscribe((response) => {
      console.log(response["body"]);
      this.products = response["body"]["products"];
    });
  }

}
