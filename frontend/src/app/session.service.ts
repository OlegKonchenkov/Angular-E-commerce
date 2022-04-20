import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  isUser(): boolean{
    if(localStorage.getItem('userLogged') == null || localStorage.getItem('userLogged') == 'custumer'){
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean{
    return localStorage.getItem('userLogged') == null ? false : true;
  }

  setLoggedInUser(type: string): void {
    localStorage.setItem('userLogged', type);
  }

  getLoggedUser(): string{
    return localStorage.getItem('userLogged');
  }

  isAdmin():boolean {
    return localStorage.getItem('userLogged') == 'admin' ? true : false;
  }

  isDelivery(): boolean {
    return localStorage.getItem('userLogged') == 'delivery' ? true : false;
  }

  isCustumer():boolean {
    return localStorage.getItem('userLogged') == 'custumer' ? true : false;
  }

  isFounder():boolean {
    return localStorage.getItem('userLogged') == 'founder' ? true : false;
  }

  logout(){
    localStorage.removeItem('userLogged');
    //localStorage.clear();
  }
}
