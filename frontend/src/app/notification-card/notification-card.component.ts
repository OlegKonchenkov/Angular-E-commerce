import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../http.service';
import { NotifyComponent } from '../notify/notify.component';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent implements OnInit {

  constructor(private _http: HttpService, private notify : NotifyComponent) { }

  @Input() notification;
  @Input() user;

  ngOnInit(): void {
  }
  
  markReaded(id){
    
    var json = {
      notification_id: id
    };
    console.log("user: " + this.user)
    console.log(json);
    if(this.user == "customer"){
      this._http.readNotification(json).subscribe((response) => {
        if(response.status == 200) {
          console.log("ok");
          this.notify.refresh();
          this.notification.visualized = true;
        }
      })
    } else if(this.user == "vendor"){
      this._http.readVendorNotification(json).subscribe((response) => {
        if(response.status == 200) {
          console.log("ok");
          this.notify.refresh();
          this.notification.visualized = true;
        }
      })
    }
    

  }
}
