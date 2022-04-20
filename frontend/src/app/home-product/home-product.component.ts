import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import {SessionService} from '../session.service';

@Component({
  selector: 'app-home-product',
  templateUrl: './home-product.component.html',
  styleUrls: ['./home-product.component.scss']
})
export class HomeProductComponent implements OnInit {

  session: SessionService;

  constructor(private _http: HttpService) { }

  ngOnInit(): void {
    this.session = new SessionService();
  }
}