import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-best-reviewed-page',
  templateUrl: './best-reviewed-page.component.html',
  styleUrls: ['./best-reviewed-page.component.scss']
})
export class BestReviewedPageComponent implements OnInit {

  constructor(private _http: HttpService) { }

  products = [];
  title = 'Prodotti meglio Recensiti';

  ngOnInit(): void {
    this._http.RatingProducts().subscribe((response) => {
      console.log(response["body"]);
      this.products = response["body"]["products"];
    });
  }

}
