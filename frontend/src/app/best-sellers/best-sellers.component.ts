import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.scss']
})
export class BestSellersComponent implements OnInit {

  mostSoldProducts;
  title = 'Prodotti più Venduti';

  startIndex = 0;
  lastIndex;

  scope = {
    items: [],
    mediator: []
  };

  dimensionNow;
  dimensionBefore;
  scrHeight;
  scrWidth;

  constructor(private _http: HttpService) { }

  ngOnInit(): void {
    this._http.MostSold().subscribe((response) => {
      //console.log("random products: " + data["products"]["_id"]);
      this.mostSoldProducts = response["body"]["products"];
      console.log(this.mostSoldProducts);
      this.scope.items = response["body"]["products"];
      this.getScreenSize();
    });
  }


  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.scrHeight = window.innerHeight;
          this.scrWidth = window.innerWidth;
          console.log(this.scrHeight, this.scrWidth);
          //cambio la dimensione di scope.mediator
          if(this.dimensionNow == null){
            if(this.scrWidth < 768) {
              this.dimensionNow = "small";
              this.lastIndex = 0;
              this.scope.mediator = [this.scope.items[0]];
              console.log(this.scope.mediator);
            } else if (this.scrWidth >= 768 && this.scrWidth < 992) {
              this.dimensionNow = "medium";
              this.lastIndex = 1;
              this.scope.mediator = [this.scope.items[0], this.scope.items[1]];
              console.log(this.scope.mediator);
            } else if (this.scrWidth >= 992 ) {
              this.dimensionNow = "large";
              this.lastIndex = 3;
              this.scope.mediator = [this.scope.items[0], this.scope.items[1], this.scope.items[2],this.scope.items[3]];
              console.log(this.scope.mediator);
            }
          } else {
            this.dimensionBefore = this.dimensionNow;
            if(this.scrWidth < 768) {
              this.dimensionNow = "small";
            } else if (this.scrWidth >= 768 && this.scrWidth < 992) {
              this.dimensionNow = "medium";
            } else if (this.scrWidth >= 992 ) {
              this.dimensionNow = "large";
            }
            if(this.dimensionBefore !== this.dimensionNow){
              if(this.dimensionBefore == "small" && this.dimensionNow == "medium"){
                
                this.lastIndex++;
                this.scope.mediator.push(this.scope.items[this.lastIndex]);

                //da cambiare gli indici
              }
              if(this.dimensionBefore == "medium" && this.dimensionNow == "large"){
                this.lastIndex++;
                this.scope.mediator.push(this.scope.items[this.lastIndex]);
                this.lastIndex++;
                this.scope.mediator.push(this.scope.items[this.lastIndex]);
              }
              if(this.dimensionBefore == "large" && this.dimensionNow == "medium"){
                this.lastIndex--;
                this.scope.mediator.pop();
                this.lastIndex--;
                this.scope.mediator.pop();
              }
              if(this.dimensionBefore == "medium" && this.dimensionNow == "small"){
                this.lastIndex--;
                this.scope.mediator.pop();
              }
              console.log(this.dimensionNow, this.dimensionBefore, this.dimensionNow);

            }
          }
          
    }

  leftClick(){
    console.log("left");
    if (this.startIndex === 0) {
      this.startIndex = this.scope.items.length-1
      this.lastIndex--
      this.scope.mediator.unshift(this.scope.items[this.scope.items.length-1])
      this.scope.mediator.pop()
    }
    else if (this.lastIndex === 0) {
      this.lastIndex = this.scope.items.length-1
      this.startIndex--
      this.scope.mediator.unshift(this.scope.items[this.startIndex])
      this.scope.mediator.pop()
    }
    else {
      this.startIndex--
      this.lastIndex--
      this.scope.mediator.unshift(this.scope.items[this.startIndex])
      this.scope.mediator.pop()
    }
    console.log('start ', this.startIndex, 'last ', this.lastIndex)
    return
  }
  
  rightClick(){
    console.log("right");
    if (this.lastIndex === this.scope.items.length-1) {
      this.lastIndex = 0
      this.startIndex++
      this.scope.mediator.shift()
      this.scope.mediator.push(this.scope.items[0])
    }
    else if (this.startIndex === this.scope.items.length-1) {
      this.startIndex = 0
      this.lastIndex++
      this.scope.mediator.shift()
      this.scope.mediator.push(this.scope.items[this.lastIndex])
    }
    else {
      this.startIndex++
      this.lastIndex++ 
      this.scope.mediator.shift()
      this.scope.mediator.push(this.scope.items[this.lastIndex])
    }
    console.log('start ', this.startIndex, 'last ', this.lastIndex)
    return
  }  

}
