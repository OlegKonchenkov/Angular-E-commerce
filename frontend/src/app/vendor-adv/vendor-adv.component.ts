import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from '../http.service';
import { WebSocketService } from '../web-socket.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-vendor-adv',
  templateUrl: './vendor-adv.component.html',
  styleUrls: ['./vendor-adv.component.scss']
})
export class VendorAdvComponent implements OnInit {

  //Variables to Set Title and Subtitle
  adv = 'Gestisci Annuncio:';

  //Variables to manage Data
  vendorName;
  vendorId;
  shopName;

  advData;
  advForm: FormGroup;
  editFormId;

  advCreated = false;
  validPassword = false;
  errorAdvCreated = false;

  selectedFile = null;
  base64Image = null;
  base64ImageCreate = null;

  constructor(private _http: HttpService, 
    private socket: WebSocketService, 
    public dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder) {}

  ngOnInit() {
    this.updateVendor();
    this.initForm();
  }

  //Get data Adv and display it on page
  updateVendor() {
    this._http.getVendorUser().subscribe((data) => {
      this.vendorId = data["admin"]["_id"];
    });
  }

  //Set the initial values of Form
  initForm() {
    this.advForm = this.fb.group({
      title: [],
      body: []
    });
  }

  //Method to Create Adv
  createAdv(event, advForm) {
    const AdvData = advForm.value;
    this.socket.emit("new_advertisement", {title: AdvData.title, body: AdvData.body, admin_id: this.vendorId});       
    const dialogRef = this.dialog.open(DialogComponent, {
      data: "L'annuncio è stato creato correttamente"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
        this.router.navigate(['/vendor-adv'])
        .then(() => {
          window.location.reload();
        });
      }
    })
  }
}