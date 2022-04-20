import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-founder',
  templateUrl: './founder.component.html',
  styleUrls: ['./founder.component.scss']
})
export class FounderComponent implements OnInit {

  //Variables to Set Title and Subtitle
  title = 'Benvenuto Fondatore!';
  subtitle = 'Il tuo Account:';

  //Variables to manage Data
  founderData;
  editFounderForm: FormGroup;
  showEditFounderForm = false;
  editFormId;

  founderChoose = false;
  vendorChoose = false;
  founderDeleted = false;
  validPassword = false;
  errorFounderEdit = false;
  errorFounderDelete = false;
  founderDeletedId;

  imageChangedEvent: any = ""
  imageBase64

  constructor(private _http: HttpService, private fb: FormBuilder) {}

  ngOnInit() {
    this.updateFounder();
  }

  //Get data Founder and display it on page
  updateFounder() {
    this._http.getFounder().subscribe((data) => {
      this.founderData = data["body"]["founder"];
    });
  }

  //Method that open Form to Edit Founder Data
  editFounder(event, founderData) {
    this.showEditFounderForm = true;
    this.editFormId = founderData.Id;
    this.editFounderForm = this.fb.group({
      first_name: [founderData.first_name],
      last_name: [founderData.last_name],
      phone_number: [founderData.phone_number],
      email: [founderData.email],
      username: [founderData.username],
      old_password: [founderData.old_password],
      new_password: [founderData.new_password]
    });
    this.imageBase64 = founderData.profile_picture;
  }

  //Method to sends and manages Founder Data
  editFounderData(event, FounderForm) {
    if (FounderForm.value.old_password == null) {
      this.validPassword = true;  
      return;
    } else {
      var FounderData = FounderForm.value;
      FounderData.profile_picture = this.imageBase64;
      this.vendorChoose = false;
      this._http.editFounderData(FounderData).subscribe((data) => {
        if(data.status == 200 && data['body']['error']==undefined){
          this.errorFounderEdit = false;
          this.founderData.first_name = FounderData.first_name;
          this.founderData.last_name = FounderData.last_name;
          this.founderData.phone_number = FounderData.phone_number;
          this.founderData.email = FounderData.email;
          this.founderData.username = FounderData.username;
          this.founderData.description = FounderData.description;
          this.founderData.profile_picture = this.imageBase64;
          this.showEditFounderForm = false;
        } else {
          this.errorFounderEdit = true;
        }
        this.validPassword = false;
      });
    }
  }

  //Method that deletes Founder Account
  deleteFounder(event) {
    this._http.deleteFounder().subscribe((data) => {
      if(data.status !== 204){
        this.errorFounderDelete = true;
      } else {
        this.errorFounderDelete = false;
      }
    });
  }

  //Method to set image of the Founder
  encodeImageFileAsURL(event) {
    this.imageChangedEvent = event
  }

  //Method to resize image of the Founder
  imageCropped(event){
    this.imageBase64 = event.base64
  }

  goToBottom(){
    window.scrollTo(0,document.body.scrollHeight);
  }
}