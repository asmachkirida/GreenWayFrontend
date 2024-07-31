import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  hide = true;
  signupForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      gender: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      console.log('Form Submitted', this.signupForm.value);
    }
  }
}
