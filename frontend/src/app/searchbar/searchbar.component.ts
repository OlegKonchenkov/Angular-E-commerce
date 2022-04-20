import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {

  options: string[] = [];
  myControl = new FormControl();
  //data: any;

  constructor(private router: Router,
    private _http: HttpService) { }

  ngOnInit(): void {
  }

  updated(){
    //da sistemare con la query dei suggerimenti da chiamare
    console.log("e")
    this.options = [];
    if (this.myControl.value.length > 0) {
      console.log(this.myControl.value)
      this._http.getSuggestion(this.myControl.value).subscribe((response) => {
        console.log(response.status)
        console.log(response["body"])
        this.options = response["body"]["names"];
      })
      /*let all = ['John', 'Jenny', 'Jonson']
      let searchedWord = this.myControl.value
      for(let key in all) {
        let r = all[key].search(new RegExp(searchedWord, "i"));
        if (r != -1) {
          this.options.push(all[key])
        }
      }*/
    } else {
      this.options = []
    }
  }

  search(){
    console.log("Click");
    console.log(this.myControl.value);
    if(this.myControl.value == null || this.myControl.value == " "){
      //dialog di errore
    } else {
      this.router.navigate(['../search',this.myControl.value]);
      //faccio il routing passando come parametro quello che ho nell'input
    }
  }

}
