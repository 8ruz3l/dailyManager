import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

  form: FormGroup = this.fb.group({
    username: ['', [ Validators.required]],
    password: ['', [ Validators.required]]
  });

  get usernameControl() { return this.form.get('username'); }

  get passwordControl() { return this.form.get('password'); }

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  login() {
    this.authService.login(this.form.value.username, this.form.value.password).subscribe(() => console.log("Redirect to Home Page"));
  }

  register() {
    this.authService.register(this.form.value.username, this.form.value.password).subscribe()
  }

}
