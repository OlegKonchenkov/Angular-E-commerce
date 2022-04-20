import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../http.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewDialogComponent } from '../review-dialog/review-dialog.component';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-order-product-detail',
  templateUrl: './order-product-detail.component.html',
  styleUrls: ['./order-product-detail.component.scss']
})
export class OrderProductDetailComponent implements OnInit {

  constructor(private _http: HttpService, public reviewDialog: MatDialog, public dialog: MatDialog) { }

  @Input() product;
  @Input() index;
  infoProduct;

  ngOnInit(): void {
    console.log(this.product);
    console.log(this.index);
    this._http.getProductByVendorIDandName(this.product.vendor_id,this.product.name).subscribe((response) => {
      console.log(response.status);
      console.log(response["body"]);
      this.infoProduct = response["body"]["products"];
      console.log(this.infoProduct);
    });
  }

  openDialog(string: string){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: string
    });
  }

  open(){
    const dialogRef2 = this.reviewDialog.open(ReviewDialogComponent, {
      disableClose: true,
      data: {rating: "",text: ""}
    });

    dialogRef2.afterClosed().subscribe(result => {
      if(result === undefined){
        console.log('The dialog was closed, do nothing');
      } else {
        console.log(result);
        //TODO: chiamata al backend per creare una review.
        var json = {
          rating: result.rating,
          text: result.text,
          id: this.infoProduct._id
        };
        this._http.addReview(json).subscribe(response =>{
          console.log(response.status);
          if(response.status == 201){
            this.openDialog("Recensione effettuata correttamente");
          } else {
            this.openDialog("Si è verificato un'errore");
          }

        });
      }
      
      
    });
  }

}
