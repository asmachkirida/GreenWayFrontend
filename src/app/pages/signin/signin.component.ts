import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }

  onSubmit(): void {
    if (this.signinForm.valid) {
      const apiUrl = 'http://localhost:8080/auth/login';
      this.http.post<any>(apiUrl, this.signinForm.value).subscribe(response => {
        console.log('Login successful', response);

        const token = response.token;
        const role = response.role;

        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', role);

        const decodedToken: any = jwtDecode(token);
        const email = decodedToken.sub;

        const getUserByEmailApiUrl = `http://localhost:8080/admin/get-user-by-email?email=${email}`;
        this.http.get<any>(getUserByEmailApiUrl).subscribe(userResponse => {
          const userId = userResponse.ourUsers.id;

          localStorage.setItem('userId', userId.toString());
          console.log('User ID:', userId);

          this.authService.updateAuthStatus(true);

          if (role === 'PASSENGER') {
            this.router.navigate(['/passenger/profile']);
          } else if (role === 'DRIVER') {
            this.router.navigate(['/driver/profile']);
          } else {
            console.error('Unknown role:', role);
          }
        }, error => {
          console.error('Failed to fetch user by email', error);
        });
      }, error => {
        console.error('Login failed', error);
      });
    }
  }
}
