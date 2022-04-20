import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  //Variables to Set Title and Subtitle
  title = 'Benvenuto Cliente!';
  subtitle = 'Il tuo Account:';

  //Variables to manage Data
  customerData;
  editCustomerForm: FormGroup;
  showEditCustomerForm = false;
  editFormId;

  customerChoose = false;
  vendorChoose = false;
  customerDeleted = false;
  validPassword = false;
  errorCustomerEdit = false;
  errorCustomerDelete = false;
  customerDeletedId;

  imageChangedEvent: any = ""
  imageBase64

  constructor(private _http: HttpService, private fb: FormBuilder) {}

  ngOnInit() {
    this.updateCustomer();
  }

  //Get data Customer and display it on page
  updateCustomer() {
    this._http.getCustumer().subscribe((data) => {
      this.customerData = data["body"]["customer"];
    });
  }

  //Method that open Form to Edit Customer Data
  editCustomer(event, customerData) {
    this.showEditCustomerForm = true;
    this.editFormId = customerData.Id;
    this.editCustomerForm = this.fb.group({
      first_name: [customerData.first_name],
      last_name: [customerData.last_name],
      email: [customerData.email],
      username: [customerData.username],
      old_password: [customerData.old_password],
      new_password: [customerData.new_password]
    });
    this.imageBase64 = customerData.profile_picture;
  }

  //Method to sends and manages Customer Data
  editCustomerData(event, CustomerForm) {
    if (CustomerForm.value.old_password == null) {
      this.validPassword = true;  
      return;
    } else {
      var CustomerData = CustomerForm.value;
      CustomerData.profile_picture = this.imageBase64;
      this.vendorChoose = false;
      this._http.editCustomerData(CustomerData).subscribe((data) => {
        if(data.status == 200 && data['body']['error']==undefined){
          this.errorCustomerEdit = false;
          this.customerData.first_name = CustomerData.first_name;
          this.customerData.last_name = CustomerData.last_name;
          this.customerData.email = CustomerData.email;
          this.customerData.username = CustomerData.username;
          this.customerData.description = CustomerData.description;
          this.customerData.profile_picture = this.imageBase64;
          this.showEditCustomerForm = false;
        } else {
          this.errorCustomerEdit = true;
        }
        this.validPassword = false;
      });
    }
  }

  //Method that deletes Customer Account
  deleteCustomer(event) {
    this._http.deleteCustomer().subscribe((data) => {
      if(data.status !== 204){
        this.errorCustomerDelete = true;
      } else {
        this.errorCustomerDelete = false;
      }
    });
  }

  //Method to set image of the Customer
  encodeImageFileAsURL(event) {
    this.imageChangedEvent = event
  }

  //Method to resize image of the Customer
  imageCropped(event){
    this.imageBase64 = event.base64
  }

  goToBottom(){
    window.scrollTo(0,document.body.scrollHeight);
  }
}