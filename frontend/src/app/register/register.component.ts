import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from '../http.service';
import { ActivatedRoute} from '@angular/router';
import { WebSocketService} from '../web-socket.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerUserForm: FormGroup;
  registerDeliveryForm: FormGroup;
  registerAdminForm: FormGroup;
  status: String;

  constructor(private formBuilder: FormBuilder, 
    private router: Router, 
    private _snackBar: MatSnackBar,
    private _http: HttpService,
    private route: ActivatedRoute,
    private webSocketService: WebSocketService) { }

  ngOnInit() {
    this.registerUserForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.registerDeliveryForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.registerAdminForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      number: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      shopname: ['', Validators.required]
    });
  }

  get userData() { return this.registerUserForm.controls; }
  
  get deliveryData() { return this.registerDeliveryForm.controls; }

  get adminData() { return this.registerAdminForm.controls; }

  onUserSubmit() {  
    if (this.registerUserForm.invalid){
      this._snackBar.open('Dati non validi', 'Riprova', {
        duration: 2000,
      });
      return;
    } else {
      var json = {
        first_name: this.userData.firstname.value,
        last_name: this.userData.lastname.value,
        username: this.userData.username.value,
        email: this.userData.email.value,
        password: this.userData.password.value
      };
      this._http.RegisterCustomer(json).subscribe(response => {
        console.log(response.status)
        if(response.status == 201){
          localStorage.setItem('userLogged', "custumer");
          this._snackBar.open('Registrazione completata', 'Successo', {
            duration: 2000,
          });
          this.router.navigate([''])
          .then(() => {
            window.location.reload();
          });
        } else {
          this._snackBar.open('Errore in fase di registrazione', 'Riprova', {
            duration: 3000,
          });
        }
      }, error =>{
        console.log(error, error.status);
        this._snackBar.open('Errore in fase di registrazione', 'Riprova', {
          duration: 3000,
        });
      });
    }
  }

  onAdminSubmit(){
    if (this.registerAdminForm.invalid){
      this._snackBar.open('Dati non validi', 'Riprova', {
        duration: 2000,
      });
      return;
    } else {
      var json = {
        first_name: this.adminData.firstname.value,
        last_name: this.adminData.lastname.value,
        phone_number: this.adminData.number.value,
        username: this.adminData.username.value,
        email: this.adminData.email.value,
        password: this.adminData.password.value,
        shop_name: this.adminData.shopname.value
      };
      this._http.RegisterAdmin(json).subscribe(response => {
        console.log(response.status)
        if(response.status == 201){
          localStorage.setItem('userLogged', "admin");
          this._snackBar.open('Registrazione completata', 'Successo', {
            duration: 2000,
          });
          this.router.navigate(['../vendor-action'], {relativeTo: this.route});
        } else {
          this._snackBar.open('Errore in fase di registrazione', 'Riprova', {
            duration: 3000,
          });
        }
      });
    }
    
  }

  onDeliverySubmit(){
    if (this.registerDeliveryForm.invalid){
      this._snackBar.open('Dati non validi', 'Riprova', {
        duration: 2000,
      });
      return;
    } else {
      var json = {
        first_name: this.deliveryData.firstname.value,
        last_name: this.deliveryData.lastname.value,
        username: this.deliveryData.username.value,
        email: this.deliveryData.email.value,
        password: this.deliveryData.password.value
      };
      this._http.RegisterDelivery(json).subscribe(response => {
        console.log(response.status)
        if(response.status == 201){
          localStorage.setItem('userLogged', "delivery");
          this._snackBar.open('Registrazione completata', 'Successo', {
            duration: 2000,
          });
          this.router.navigate(['../delivery-state/Created'], {relativeTo: this.route});
        } else {
          this._snackBar.open('Errore in fase di registrazione', 'Riprova', {
            duration: 3000,
          });
        }
      });
    }

  }
}
