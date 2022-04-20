import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute} from '@angular/router';
import { WebSocketService} from '../web-socket.service';
import { NotifyComponent } from '../notify/notify.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private webSocketService: WebSocketService, 
    private notify : NotifyComponent) { }

    
  username: string;
    
  ngOnInit(): void {
    console.log(localStorage.getItem('username'));
    //da controllare se è null si può distruggere qui la socket che vuol dire che non c'è nessuno loggato,
    //in fase di logout si può rimuovere semplicemente la variabile dal localstorage
    this.username = localStorage.getItem('username');
    console.log(this.username);
    if(this.username !== null){
      console.log("prova");
      this.webSocketService.listen(this.username).subscribe((data) => {
        console.log("HOME COMPONENT: " + data);
        //così forse ricarico la navbar
        this.notify.refresh();
      });
    }
    
    if(localStorage.getItem('userLogged') == "admin"){
      console.log("admin");
      this.router.navigate(['../vendor-action'], {relativeTo: this.route});
    } else if (localStorage.getItem('userLogged') == "custumer") {
      console.log("custumer");
    } else if(localStorage.getItem('userLogged') == "delivery"){
      console.log("delivery");
      this.router.navigate(['../delivery-state/Created'], {relativeTo: this.route});
    } else if(localStorage.getItem('userLogged') == "founder"){
      console.log("founder");
      this.router.navigate(['../founder'], {relativeTo: this.route});
    }
  }

}