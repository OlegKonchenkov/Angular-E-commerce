import { Component, OnInit} from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import {SessionService} from '../session.service'; 
import { HttpService } from '../http.service';
import { WebSocketService} from '../web-socket.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user: string;
  session: SessionService;
  products = [];
  cart;
  notifications = [];
  size;


  constructor(private router: Router,private _http: HttpService,private webSocketService: WebSocketService) { 
    
  }

  ngOnInit(): void {
    this.session = new SessionService();
    if(this.session.isCustumer()){
      this._http.getCart().subscribe((response) => {
        console.log(response.status);
          console.log(response["body"]);
          this.cart = response["body"]["shopping_cart"];
          console.log(this.cart);
          if( this.cart != null) {
            this.products = response["body"]["shopping_cart"]["items"];
          }
          
      });
      /*this._http.getNotVisualizedNotification().subscribe((response) => {
        console.log(response.status);
        console.log(response["body"]["notifications"]);
        this.notifications = response["body"]["notifications"];
      })*/
    } 
    

  }

  refreshCart(){
      this._http.getCart().subscribe((response) => {
        console.log(response.status);
          console.log(response["body"]);
          this.cart = response["body"]["shopping_cart"];
          console.log(this.cart);
          if( this.cart != null) {
            this.products = response["body"]["shopping_cart"]["items"];
            this.size = this.products.length;
            setTimeout(() => {
              document.getElementById("cartcount").innerHTML = this.size;
            });
          }
          
      });
      
  }

  logout(){
    this._http.Logout().subscribe(response => {
      console.log(response.status);
      if(response.status == 200){
        this.webSocketService.logout();
        this.session.logout();
        this.router.navigate([''])
            .then(() => {
                window.location.reload();
            });
      } else {
      }
      
    });

    
  }

  


  //servono i metodi per sapere il numero di prodotti nel carrello e se ci sono messaggi/notifiche da leggere
  

}
