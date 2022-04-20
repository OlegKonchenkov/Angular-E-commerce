import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  constructor(private _Activatedroute:ActivatedRoute,
    private _http: HttpService) { }

  category;
  products;

  ngOnInit(): void {
    //this.name=this._Activatedroute.snapshot.paramMap.get("name");
    //console.log(this.name);
    this._Activatedroute.params.subscribe(params => {
      this.category = params['name']; // (+) converts string 'id' to a number
      this._http.getProductByType(this.category).subscribe((response) =>{
        console.log(response.status);
        console.log(response["body"]);
        this.products = response["body"]["products"];
        console.log(this.products);
      });
    });
    
  }

}
