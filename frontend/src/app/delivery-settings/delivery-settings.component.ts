import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-delivery-settings',
  templateUrl: './delivery-settings.component.html',
  styleUrls: ['./delivery-settings.component.scss']
})
export class DeliverySettingsComponent implements OnInit {

  //Variables to Set Title and Subtitle
  title = 'Benvenuto Fattorino, al lavoro!';
  subtitle = 'Il tuo Account';

  //Variables to manage Data
  deliveryData;
  editDeliveryForm: FormGroup;
  showEditDeliveryForm = false;
  editFormId;

  deliveryChoose = false;
  productDeleted = false;
  deliveryDeleted = false;
  validPassword = false;
  errorDeliveryEdit = false;
  productDeletedId;
  productChooseId;
  deliveryDeletedId; 

  imageChangedEvent: any = ""
  imageBase64

  constructor(private _http: HttpService, private fb: FormBuilder) {}

  ngOnInit() {
    this.updateDelivery();
  }

  //Get data delivery and display it on page
  updateDelivery() {
    this._http.getDelivery().subscribe((data) => {
      this.deliveryData = data["body"]["delivery"];
    });
  }

  //Method that opens Form to Edit Delivery
  editDelivery(event, deliveryData) {
    this.showEditDeliveryForm = true;
    this.editFormId = deliveryData.Id;
    this.editDeliveryForm = this.fb.group({
      _id: [deliveryData._id],
      first_name: [deliveryData.first_name],
      last_name: [deliveryData.last_name],
      email: [deliveryData.email],
      username: [deliveryData.username],
      old_password: [deliveryData.old_password],
      new_password: [deliveryData.new_password],
      shop_name: [deliveryData.shop_name]
    });
    this.imageBase64 = deliveryData.shop_picture;
  }

  //Method that sends and manages new data of Delivery
  editDeliveryData(event, DeliveryForm) {
    if (DeliveryForm.value.old_password == null) {
      this.validPassword = true;  
      return;
    } else {
      var DeliveryData = DeliveryForm.value;
      DeliveryData.shop_picture = this.imageBase64;
      this.deliveryChoose = false;
      this._http.editDeliveryData(DeliveryData).subscribe((data) => {
        if(data.status == 200 && data['body']['error']==undefined){
          this.errorDeliveryEdit = false;
          this.deliveryData.first_name = DeliveryData.first_name;
          this.deliveryData.last_name = DeliveryData.last_name;
          this.deliveryData.email = DeliveryData.email;
          this.deliveryData.username = DeliveryData.username;
          this.deliveryData.shop_name = DeliveryData.shop_name;
          this.deliveryData.profile_picture = this.imageBase64;
          this.showEditDeliveryForm = false;
        } else {
          this.errorDeliveryEdit = true;
        }
        this.validPassword = false;
      });
    }
  }

  //Method that deletes Delivery Account
  deleteDelivery(event, DeliveryData) {
    this._http.deleteVendor(DeliveryData).subscribe((data) => {
      if(data.status == 204){
        this.productDeletedId = DeliveryData.id;
        this.productDeleted = true;
        setTimeout(() => {
          this.productDeleted = false;
        }, 2000);
      }
    });
  }

  //Method to set image of the Delivery Account
  encodeImageFileAsURL(event) {
    this.imageChangedEvent = event
  }

  //Method to resize image of the Delivery Account
  imageCropped(event){
    this.imageBase64 = event.base64
  }

  //Focus on form
  goToBottom(){
    window.scrollTo(0,document.body.scrollHeight);
  }
}