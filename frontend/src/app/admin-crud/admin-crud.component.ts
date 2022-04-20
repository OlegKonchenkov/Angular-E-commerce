import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
    selector: 'app-admin-crud',
    templateUrl: './admin-crud.component.html',
    styleUrls: ['./admin-crud.component.scss']
})
export class AdminCRUDComponent implements OnInit {

  //Variables to Set Title and Subtitle
  title = 'Benvenuto Commerciante!';
  subtitle = 'Il Mio Account:';

  //Variables to manage Data
  vendorName;
  vendorId;
  shopName;

  vendorData;
  editVendorForm: FormGroup;
  showEditVendorForm = false;
  editFormId;

  vendorChoose = false;
  productDeleted = false;
  vendorDeleted = false;
  validPassword = false;
  errorVendorEdit = false;
  productDeletedId;
  productChooseId;
  vendorDeletedId; 

  imageChangedEvent: any = ""
  imageBase64

  constructor(private _http: HttpService, 
    public dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder) {}

  ngOnInit() {
    this.updateVendor();
  }

  //Get data vendor and display it on page
  updateVendor() {
    this._http.getVendorUser().subscribe((data) => {
      this.vendorData = data["admin"];
      this.vendorId = data["admin"]["_id"];
      this.vendorName = data["admin"]["first_name"];
      this.shopName = data["admin"]["shop_name"];
    });
  }

  //Method that opens Form to Edit Vendor
  editVendor(event, vendorData) {
    this.showEditVendorForm = true;
    this.editFormId = vendorData.Id;
    this.editVendorForm = this.fb.group({
      _id: [vendorData._id],
      first_name: [vendorData.first_name],
      last_name: [vendorData.last_name],
      phone_number: [vendorData.phone_number],
      email: [vendorData.email],
      username: [vendorData.username],
      old_password: [vendorData.old_password],
      new_password: [vendorData.new_password],
      shop_name: [vendorData.shop_name],
      description: [vendorData.description]
    });
    this.imageBase64 = vendorData.shop_picture;
  }

  //Method that sends and manages new data of Vendor
  editVendorData(event, VendorForm) {
    if (VendorForm.value.old_password == null) {
      this.validPassword = true;  
      return;
    } else {
      var VendorData = VendorForm.value;
      VendorData.shop_picture = this.imageBase64;
      this.vendorChoose = false;
      this._http.editVendorData(VendorData).subscribe((data) => {
        if(data.status == 200 && data['body']['error']==undefined){
          this.errorVendorEdit = false;
          console.log('vendor edited', data);
          this.vendorData.first_name = VendorData.first_name;
          this.vendorData.last_name = VendorData.last_name;
          this.vendorData.phone_number = VendorData.phone_number;
          this.vendorData.email = VendorData.email;
          this.vendorData.username = VendorData.username;
          this.vendorData.shop_name = VendorData.shop_name;
          this.vendorData.description = VendorData.description;
          this.vendorData.shop_picture = this.imageBase64;
          this.showEditVendorForm = false;

          const dialogRef = this.dialog.open(DialogComponent, {
            data: "I tuoi dati sono stati modificati con successo"
          });
          dialogRef.afterClosed().subscribe(result => {
            if(result == true){
              this.router.navigate(['/admin'])
              .then(() => {
                window.location.reload();
              });
            }
          })
        } else {
          this.errorVendorEdit = true;
        }
        this.validPassword = false;
      });
    }
  }

  //Method that deletes Vendor Account
  deleteVendor(event, VendorData) {
    this._http.deleteVendor(VendorData).subscribe((data) => {
      if(data.status == 204){
        this.productDeletedId = VendorData.id;
        this.productDeleted = true;
        setTimeout(() => {
          this.productDeleted = false;
        }, 2000);
      }
    });
  }

  //Method to set image of the Vendor
  encodeImageFileAsURL(event) {
    this.imageChangedEvent = event
  }

  //Method to resize image of the Customer
  imageCropped(event){
    this.imageBase64 = event.base64
  }

  //Focus on form
  goToBottom(){
    window.scrollTo(0,document.body.scrollHeight);
  }
}