import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-vendor-action',
  templateUrl: './vendor-action.component.html',
  styleUrls: ['../admin-crud/admin-crud.component.scss']
})

export class VendorActionComponent implements OnInit {

  //Variables to Set Title and Subtitle
  products = 'Gestisci Prodotti:';
  noProducts = 'Non ci sono Prodotti da Visualizzare!';

  //Variables to manage Data
  vendorName;
  vendorId;
  shopName;

  productData;
  productForm: FormGroup;
  editProductForm: FormGroup;
  showEditProductForm = false;
  editFormId;

  productCreated = false;
  productEdited = false;
  productChoose = false;
  productDeleted = false;
  validPassword = false;
  errorProductCreated = false;
  errorProductEdit = false;
  productDeletedId;
  productChooseId;

  imageChangedEvent: any = ""
  imageBase64

  //Category of Products
  selectedOption = "Abbigliamento";
  options = [
    { name: "Abbigliamento", value: 1 },
    { name: "Alimenti", value: 2 },
    { name: "Giochi", value: 3 },
    { name: "Veicoli", value: 4 },
    { name: "Casa", value: 5 },
    { name: "Elettronica", value: 6 },
    { name: "Film", value: 7 },
    { name: "TV", value: 8 },
    { name: "Videogiochi", value: 9 },
    { name: "Altro", value: 10 }
  ]

  constructor(private _http: HttpService, 
    public dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder) {}

  ngOnInit() {
    this.updateVendor();
    this.initForm();
  }

  //Get data vendor and display it on page
  updateVendor() {
    this._http.getVendorUser().subscribe((data) => {
      this.vendorId = data["admin"]["_id"];
      this.vendorName = data["admin"]["first_name"];
      this.shopName = data["admin"]["shop_name"];
      this.updateProduct(this.vendorId);
    });
  }

  //Get data product and display it on page
  updateProduct(Id) {
    this._http.getVendorProduct(Id).subscribe((data) => {
      this.productData = data["products"];
    });
  }

  //Set the initial values of Form
  initForm() {
    this.productForm = this.fb.group({
      vendor_name: [],
      shop_name: [],
      name: [],
      type: [],
      price: [],
      sale: [],
      rating: ["0"],
      description: [],
      product_picture: [],
      quantity: [],
      availability: []
    });
  }

  //Method to Create Product
  createProduct(event, productForm) {
    var ProductData = productForm.value;
    ProductData.product_picture = this.imageBase64;
    ProductData.vendor_name = this.vendorName;
    ProductData.shop_name = this.shopName;
    this._http.createProduct(ProductData).subscribe((data) => {
      if(data.status == 201 && data['body']['error']==undefined){
        this.errorProductCreated = false;
        this.productCreated = true;
        ProductData._id = data['body']['_id'];
        this.productData.push(ProductData);
        const dialogRef = this.dialog.open(DialogComponent, {
          data: "Il prodotto è stato aggiunto alla tua lista di prodotti con successo"
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result == true){
            this.router.navigate(['/vendor-action'])
            .then(() => {
              window.location.reload();
            });
          }
        })
      } else {
        this.errorProductCreated = true;
      }
      setTimeout(() => {
        this.productCreated = false;
      }, 2000);
    });
  }
  
  //Method that opens form to Edit Product
  editProduct(event, productForm) {
    this.showEditProductForm = true;
    this.editFormId = productForm._id;
    this.productChooseId = productForm._id;
    this.productChoose = true;
    this.editProductForm = this.fb.group({
      _id: [productForm._id],
      vendor_name: this.vendorName,
      new_name: [productForm.name],
      type: [productForm.type],
      price: [productForm.price],
      sale: [productForm.sale],
      description: [productForm.description],
      quantity: [productForm.quantity],
      availability: []
    });
    this.selectedOption = productForm.type;
    this.imageBase64 = productForm.product_picture;
  }

  //Method that sends and manage new data of Product
  editProductData(event, productForm) {
    var ProductData = productForm.value;
    ProductData.product_picture = this.imageBase64;
    this.productChoose = false;
    this._http.editProduct(ProductData).subscribe((data) => {
      if(data.status == 200 && data['body']['error']==undefined){
        this.errorProductEdit = false;
        let i = 0;
        //Rischio loop infinito, tanto so che il prodotto c'e' perché
        //prima lo ha trovato ed ha chiamato questa funzione.
        while (this.productData[i]._id !== ProductData._id) {
          i++;
        }
        this.productData.splice(i, 1);
        this.productData.push(ProductData);
        this.productEdited = true;
        setTimeout(() => {
          this.productEdited = false;
          this.showEditProductForm = false;
        }, 2000);
      } else {
        this.errorProductEdit = true;
      }
    });
  }

  //Method that deletes Product
  deleteProduct(event, idToDelete) {
    this._http.deleteProduct(idToDelete._id).subscribe((data) => {
      if(data.status == 204){
        let i = 0;
        //Rischio loop infinito, tanto so che il prodotto c'e' perché
        //prima lo ha trovato ed ha chiamato questa funzione.
        while (this.productData[i]._id !== idToDelete._id) {
          i++;
        }
        this.productData.splice(i, 1);
        this.productDeletedId = idToDelete._id;
        this.productDeleted = true;
        setTimeout(() => {
          this.productDeleted = false;
        }, 2000);
      }
    });
  }

  //Method to set image of the Product
  encodeImageFileAsURL(event) {
    this.imageChangedEvent = event
  }

  //Method to resize image of the Product
  imageCropped(event){
    this.imageBase64 = event.base64
  }

  //Focus on form
  goToBottom(){
    window.scrollTo(0,document.body.scrollHeight);
  }
}