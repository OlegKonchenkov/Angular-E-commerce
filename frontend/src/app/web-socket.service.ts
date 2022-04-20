import { Injectable, EventEmitter } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket:any;
  //indirizzo a cui collegarsi da modificare 
  readonly uri: string = "http://localhost:8081";

  constructor() {
    this.socket = io(this.uri);
   }

  listen(eventName: string){
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      })
    });
  }

  emit(eventName: string, data: any){
    this.socket.emit(eventName,data);
  }

  logout(){
    this.socket.off(localStorage.getItem('username'));
    localStorage.removeItem('username');
  }
}


