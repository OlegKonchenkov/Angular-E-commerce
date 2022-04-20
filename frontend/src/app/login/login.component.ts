import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute} from '@angular/router';
import { WebSocketService} from '../web-socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  userLogged: string;

  constructor(private formBuilder: FormBuilder, 
    private router: Router,
    private _http: HttpService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private webSocketService: WebSocketService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get data() { return this.loginForm.controls; }

  onSubmit() {  
    if (this.loginForm.invalid) {
      this.submitted = true;  
      return;
    } else {
      var json = {
        username: this.data.username.value,
        password: this.data.password.value
      };
      this._http.Login(json).subscribe(response => {
        console.log(response.status);
        console.log(response["body"]);
        console.log(response["body"]["profile_type"]);
        if(response.status == 200){
          this.userLogged = response["body"]["profile_type"];
          console.log(this.userLogged);
          localStorage.setItem('username', json.username);
          if(this.userLogged == "Admin"){
            console.log("admin login");
            localStorage.setItem('userLogged', "admin");
            this.router.navigate(['../vendor-action'], {relativeTo: this.route});
          } else if(this.userLogged == "Customer"){
            console.log("user login");
            localStorage.setItem('userLogged', "custumer");
            this.router.navigate([''])
              .then(() => {
                window.location.reload();
              });
          } else if(this.userLogged == "Delivery Guy"){
            console.log("delivery login");
            localStorage.setItem('userLogged', "delivery");
            this.router.navigate(['../delivery-state/Created'], {relativeTo: this.route});
          } else if(this.userLogged == "Founder"){
            console.log("founder login");
            localStorage.setItem('userLogged','founder');
            this.router.navigate(['../founder'], {relativeTo: this.route});
          }
        } else {
          this._snackBar.open('Errore in fase di login', 'Riprova', {
            duration: 3000,
          });
        }
      }, error =>{
        console.log(error, error.status);
        this._snackBar.open('Errore in fase di login', 'Riprova', {
          duration: 3000,
        });
      });
    } 
    
  }
}
