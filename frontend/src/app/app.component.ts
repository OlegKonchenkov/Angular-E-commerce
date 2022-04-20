import { Component, OnInit } from '@angular/core';
import { WebSocketService} from './web-socket.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'E-Commerce Site';

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(){
    this.webSocketService.listen("customer").subscribe((data) => {
      console.log("APP COMPONENT: " + data);
    })
    let cc = window as any;
       cc.cookieconsent.initialise({
         palette: {
           popup: {
             background: "#164969"
           },
           button: {
             background: "#ffe000",
             text: "#164969"
           }
         },
         theme: "classic",
         content: {
           message: "This website uses cookies to ensure you get the best experience in our website",
         }
       });
  }
}
