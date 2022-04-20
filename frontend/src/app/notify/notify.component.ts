import { Component, OnInit, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit {

  constructor(private _http: HttpService, private _cdr: ChangeDetectorRef) {
    
   }

  notifications  =  [] ;
  size;

  ngOnInit(): void {
    if(localStorage.getItem('userLogged') == 'custumer'){
      this._http.getNotVisualizedNotification().subscribe((response) => {
        console.log(response.status);
        console.log(response["body"]["notifications"]);
          this.notifications = response["body"]["notifications"];
          this.size = this.notifications.length;
          
      })
    } else if(localStorage.getItem('userLogged') == 'admin'){
      this._http.getVendorNotVisualizedNotification().subscribe((response) => {
        console.log(response.status);
        this.notifications = response["body"]["notifications"];
        this.size = this.notifications.length;
          
      })
    }
  }

  refresh(){
    console.log("Notify REFRESH");
    if(localStorage.getItem('userLogged') == 'custumer'){
      this._http.getNotVisualizedNotification().subscribe((response) => {
        console.log(response.status);
        console.log(response["body"]["notifications"]);
          this.notifications = response["body"]["notifications"];
          this.size = this.notifications.length;
          console.log(this.size);
          setTimeout(() => {
            document.getElementById("notify").innerHTML = this.size;
          });
      })
    } else if(localStorage.getItem('userLogged') == 'admin'){
      console.log("Notify REFRESH");
      this._http.getVendorNotVisualizedNotification().subscribe((response) => {
        console.log(response.status);
        this.notifications = response["body"]["notifications"];
        this.size = this.notifications.length;
          console.log(this.size);
          setTimeout(() => {
            document.getElementById("notify").innerHTML = this.size;
          });
      })
    }
  }

}
