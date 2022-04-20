import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { OrderDialogComponent } from '../order-dialog/order-dialog.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  products : Array<any> = [];
  total;
  valueEmittedFromChildComponent;

  constructor(private _http: HttpService,public dialog: MatDialog,private router: Router,public orderDialog: MatDialog, private navbar: NavbarComponent) { }

  ngOnInit(): void {
    this._http.getCart().subscribe((response) => {
      console.log(response.status);
        console.log(response["body"]);
        this.total= response["body"]["shopping_cart"]["totalPrice"];
        this.products = response["body"]["shopping_cart"]["items"];
    });

  }

  parentEventHandlerFunction(valueEmitted){
    //prendo l'indice
      this.valueEmittedFromChildComponent = valueEmitted;
      var removed = this.products[this.valueEmittedFromChildComponent];
      console.log(removed);
      var name = removed["name"];
      
      var vendor_id = removed["vendor_id"];
      //chiamo il backend
      this._http.deleteFromCart(name,vendor_id).subscribe((response) => {
        console.log(response.status);
        if(response.status == 200){
          console.log(response["body"]["cart"]["totalPrice"]);
          this.total = response["body"]["cart"]["totalPrice"];
          this.products.splice(this.valueEmittedFromChildComponent,1);
          this.openDialog('Prodotto eliminato dal carrello correttamente',false);
          //chiamo la navbar che refresha il contenuto del carrello
          this.navbar.refreshCart();

        }
      })
      console.log(this.products);
      console.log(this.valueEmittedFromChildComponent);
  }

  openDialog(string: string, bool: boolean){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: string
    });
    if(bool == true) {
      dialogRef.afterClosed().subscribe(res => {
        if(res == true){
          this.router.navigate([''])
              .then(() => {
                window.location.reload();
              });
        }
        
      })
    }
  }

  open(){
    const dialogRef2 = this.orderDialog.open(OrderDialogComponent, {
      /*height: '600px',
      width: '600px',*/
      disableClose: true,
      data: {payment_type: "",card_number: "", country: "", city: "", street: "", info: ""}
    });

    dialogRef2.afterClosed().subscribe(result => {
      if(result === undefined){
        console.log('The dialog was closed, do nothing');
      } else {
        console.log(result.payment_type, result.card_number, result.country, result.info, result);
        //TODO: chiamata al backend per creare un ordine.
        var json = {
          payment_type: result.payment_type,
          card_number: result.card_number,
          country: result.country,
          city: result.city,
          street: result.street,
          info: result.info
        };
        this._http.createOrder(json).subscribe(response =>{
          console.log(response.status);
          if(response.status == 201){
            this.openDialog("Ordine effettuato correttamente",true);
          }
        })
      }
    });
  }
}
