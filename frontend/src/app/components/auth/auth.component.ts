import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

  form: FormGroup = this.fb.group({
    username: ['', [Validators.minLength(6)]],
    password: ['', [Validators.minLength(6)]]
  });

  get usernameControl() { return this.form.get('username'); }

  get passwordControl() { return this.form.get('password'); }

  constructor(private fb: FormBuilder) { }

  login() {
    console.log(this.usernameControl?.errors);
  }

  register() {
    console.log('register');
  }

}
