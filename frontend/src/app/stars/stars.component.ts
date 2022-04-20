import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss']
})
export class StarsComponent implements OnInit {

  constructor() { }

  @Input() rating;
  stella1;
  stella2;
  stella3;
  stella4;
  stella5;


  ngOnInit(): void {
    console.log(this.rating);
    if(this.rating<1 && this.rating >= 0){
      this.stella1 = "assets/star0.png";
      this.stella2 = "assets/star0.png";
      this.stella3 = "assets/star0.png";
      this.stella4 = "assets/star0.png";
      this.stella5 = "assets/star0.png";
    } else if(this.rating<2 && this.rating >= 1) {
      this.stella1 = "assets/star1.png";
      this.stella2 = "assets/star0.png";
      this.stella3 = "assets/star0.png";
      this.stella4 = "assets/star0.png";
      this.stella5 = "assets/star0.png";
    } else if(this.rating<3 && this.rating >= 2) {
      this.stella1 = "assets/star1.png";
      this.stella2 = "assets/star1.png";
      this.stella3 = "assets/star0.png";
      this.stella4 = "assets/star0.png";
      this.stella5 = "assets/star0.png";
    } else if(this.rating<4 && this.rating >= 3) {
      this.stella1 = "assets/star1.png";
      this.stella2 = "assets/star1.png";
      this.stella3 = "assets/star1.png";
      this.stella4 = "assets/star0.png";
      this.stella5 = "assets/star0.png";
    } else if(this.rating<5 && this.rating >= 4) {
      this.stella1 = "assets/star1.png";
      this.stella2 = "assets/star1.png";
      this.stella3 = "assets/star1.png";
      this.stella4 = "assets/star1.png";
      this.stella5 = "assets/star0.png";
    } else {
      this.stella1 = "assets/star1.png";
      this.stella2 = "assets/star1.png";
      this.stella3 = "assets/star1.png";
      this.stella4 = "assets/star1.png";
      this.stella5 = "assets/star1.png";
    }
  }

  
}
