import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { SessionService } from '../session.service'; 
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  id;
  product;
  session: SessionService;
  selectedOption: number;
  number;

  options = [
    { name: 1, value: 1 },
    { name: 2, value: 2 },
    { name: 3, value: 3 }
  ]

  constructor(private _Activatedroute:ActivatedRoute,
    private _http: HttpService,
    private router: Router,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.session = new SessionService();
    this.id=this._Activatedroute.snapshot.paramMap.get("id");
    console.log(this.id);
    this._http.ProductDetail(this.id).subscribe((response) => {
      this.product = response["body"]["products"];
    });
    
  }

  addToCart(){
    if(this.selectedOption != undefined){
      console.log(this.selectedOption);
      var json = {
        vendor_id: this.product.vendor_id,
        product_name: this.product.name,
        product_price: this.product.price,
        product_quantity: this.selectedOption,
        product_sale:  this.product.sale
      };
      this._http.AddToCart(json).subscribe((response) => {
        console.log(response.status);
        console.log(response["body"]);
        if(response.status == 201){
          const dialogRef = this.dialog.open(DialogComponent, {
            data: 'Prodotto aggiunto al carrello'
          });
          dialogRef.afterClosed().subscribe(result => {
            if(result == true){
              this.router.navigate([''])
              .then(() => {
                window.location.reload();
              });
            }
          })
        } else if(response.status == 200) {
          const dialogRef = this.dialog.open(DialogComponent, {
            data: 'Il prodotto era gi?? presente nel carrello, quantit?? aggiornata'
          });
          dialogRef.afterClosed().subscribe(result => {

          })
        }
        
      });
    } else {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: 'Errore, seleziona la quantit??'
      });
      console.log("Seleziona quantit??");
      //alert, seleziona la quantit?? del prodotto
    }
    
  }
  
}
