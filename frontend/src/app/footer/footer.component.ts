import { Component, OnInit } from '@angular/core';
import {SessionService} from '../session.service'; 

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }

  session: SessionService;

  ngOnInit(): void {
    this.session = new SessionService();
  }

}