import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(private _http: HttpService,
    private _Activatedroute:ActivatedRoute,) { }

  user;
  notifications = [];

  ngOnInit(): void {
    this.user=this._Activatedroute.snapshot.paramMap.get("user");
    console.log(this.user);
    if(this.user == "customer"){
      this._http.getCustumer().subscribe((response) => {
        this.notifications = response["body"]["customer"]["notifications"];
        console.log(this.notifications);
      })
    } else if (this.user == "vendor") {
      this._http.getVendorNotification().subscribe((response) => {
        this.notifications = response["body"]["admin"]["notifications"];
        console.log(this.notifications);
      })

    }
    
  }

}
