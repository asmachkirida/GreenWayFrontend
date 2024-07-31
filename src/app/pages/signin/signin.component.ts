import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';  // Adjust the path as necessary

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  hide = true;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Any additional initialization logic
  }

  onSubmit(): void {
    if (this.signinForm.valid) {
      this.authService.login(this.signinForm.value).subscribe(response => {
        // Handle successful login
        console.log('Login successful', response);
        // Redirect or perform other actions here
      }, error => {
        // Handle login error
        console.error('Login failed', error);
      });
    }
  }
}
