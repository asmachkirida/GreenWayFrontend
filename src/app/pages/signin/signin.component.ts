import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  hide = true;  // This will control the visibility of the password field

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Email field with validation
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Any additional initialization logic
  }

  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }

  onSubmit(): void {
    if (this.signinForm.valid) {
      const apiUrl = 'http://localhost:8080/auth/login';
      this.http.post<any>(apiUrl, this.signinForm.value).subscribe(response => {
        console.log('Login successful', response);

        // Assuming the API returns a token and user role
        const token = response.token;
        const role = response.role; // Adjust based on your API response

        // Save token and user role
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', role);

        // Redirect based on user role
        if (role === 'PASSENGER') {
          this.router.navigate(['/passenger']);
        } else if (role === 'DRIVER') {
          this.router.navigate(['/driver']);
        } else {
          console.error('Unknown role:', role);
        }
      }, error => {
        console.error('Login failed', error);
        // Handle login error
      });
    }
  }
}
