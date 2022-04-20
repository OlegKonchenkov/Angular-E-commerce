import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {

  constructor(private _http: HttpService) { }

  vendors = [];

  ngOnInit(): void {
    //prendo tutti i vendors e li mostro al click vado nella pagina del vendor, fine
    this._http.getVendors().subscribe((response) =>{
      console.log(response["body"]);
      if(response.status == 200){
        this.vendors = response["body"]["admin"]

      }
      console.log(response.status, this.vendors);
    });

  }

}
