import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-founder-action',
  templateUrl: './founder-action.component.html',
  styleUrls: ['../founder/founder.component.scss']
})

export class FounderActionComponent implements OnInit {

  //Variables to Set Title and Subtitle
  vendors = 'Gestisci Commercianti:';
  noVendors = 'Non ci sono Commercianti da Visualizzare!';

  //Variables to manage Data
  vendorsData;
  vendorForm: FormGroup;
  editVendorForm: FormGroup;
  showEditVendorsForm = false;
  editFormId;

  vendorEdited = false;
  vendorChoose = false;
  vendorDeleted = false;
  validPassword = false;
  errorProductCreated = false;
  errorVendorEdit = false;
  vendorDeletedId;
  vendorChooseId;

  selectedFile = null;
  base64Image = null;
  base64ImageCreate = null;

  //Account status of Vendors
  selectedOption = "Pending";
  options = [
    { name: "Pending", value: 1 },
    { name: "Suspended", value: 2 },
    { name: "Active", value: 3 },
    { name: "Banned", value: 4 }
  ]

  constructor (private _http: HttpService, private fb: FormBuilder) {}

  ngOnInit() {
    this.updateVendor();
    this.initForm();
  }

  //Get data product and display it on page
  updateVendor() {
    this._http.getListOfVendors().subscribe((data) => {
      this.vendorsData = data["body"]["vendors"]; 
    });
  }

  //Set initial fields of form
  initForm() {
    this.vendorForm = this.fb.group({
      _id: [],
      username: [],
      shop_picture: [],
      shop_name: [],
      email: [],
      registration_status: []      
    });
  }
  
  //Open edit vendor form
  editVendor(event, vendorForm) {
    this.showEditVendorsForm = true;
    this.editFormId = vendorForm._id;
    this.vendorChooseId = vendorForm._id;
    this.vendorChoose = true;
    this.editVendorForm = this.fb.group({
      vendor_id: [vendorForm._id],
      username: [vendorForm.username],
      shop_picture: [vendorForm.shop_picture],
      email: [vendorForm.email],
      registration_status: [vendorForm.registration_status]
    });
    this.selectedOption = vendorForm.registration_status;
  }

  //Save and send new data of vendor
  editVendorData(event, vendorForm) {
    const VendorData = vendorForm.value;
    this.vendorChoose = false;
    this._http.editVendorStatus(VendorData).subscribe((data) => {
      if(data.status == 200 && data['body']['error']==undefined){
        this.errorVendorEdit = false;
        let i = 0;
        //Rischio loop infinito, tanto so che il prodotto c'è perché
        //prima lo ha trovato ed ha chiamato questa funzione.
        while (this.vendorsData[i].username !== VendorData.username) {
          i++;
        }
        this.vendorsData.splice(i, 1);
        this.vendorsData.push(VendorData);
        this.vendorEdited = true;
        setTimeout(() => {
          this.vendorEdited = false;
          this.showEditVendorsForm = false;
        }, 2000);
      } else {
        this.errorVendorEdit = true;
      }
    });
  }

  //Delete the vendor's account
  deleteVendor(event, idToDelete) {
    this._http.deleteVendorFromFounder(idToDelete._id).subscribe((data) => {
      if(data.status == 204){
        let i = 0;
        //Rischio loop infinito, tanto so che il prodotto c'e' perché
        //prima lo ha trovato ed ha chiamato questa funzione.
        while (this.vendorsData[i]._id !== idToDelete._id) {
          i++;
        }
        this.vendorsData.splice(i, 1);
        this.vendorDeletedId = idToDelete._id;
        this.vendorDeleted = true;
        setTimeout(() => {
          this.vendorDeleted = false;
        }, 2000);
      }
    });
  }

  //Method to set image of the vendors
  encodeImageFileAsURL(event) {
    this.selectedFile = event.target.files[0]
    var reader = new FileReader();
    reader.onloadend = () => {
      this.base64Image = reader.result
    }
    reader.readAsDataURL(this.selectedFile);
  }

  //Focus on form
  goToBottom(){
    window.scrollTo(0,document.body.scrollHeight);
  }
}