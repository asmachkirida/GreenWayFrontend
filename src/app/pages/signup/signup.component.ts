import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare var google: any;

interface RegisterResponse {
  token: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  autocompleteCity: any;
  hide: boolean = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      gender: ['', Validators.required],
      role: ['PASSENGER', Validators.required],
      password: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.initAutocomplete();
  }

  ngOnDestroy(): void {
    if (this.autocompleteCity) {
      google.maps.event.clearInstanceListeners(this.autocompleteCity);
    }
  }

  initAutocomplete(): void {
    const cityInput = document.getElementById('city') as HTMLInputElement;

    if (google && google.maps && google.maps.places) {
      this.autocompleteCity = new google.maps.places.Autocomplete(cityInput, { types: ['(cities)'] });

      this.autocompleteCity.addListener('place_changed', () => {
        const place = this.autocompleteCity.getPlace();
        if (place && place.formatted_address) {
          this.signupForm.patchValue({ city: place.formatted_address });
        }
      });
    } else {
      console.error('Google Maps API is not loaded');
    }
  }

  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;
      console.log('Form Submitted:', formData);

      this.http.post<RegisterResponse>('http://localhost:8080/auth/register-passenger', {
        ...formData,
        membership: 'Normal'
      }).subscribe(
        response => {
          console.log('Registration successful:', response);
          
          localStorage.setItem('authToken', response.token);

          // Update the authentication state
          this.authService.updateAuthStatus(true);

          this.router.navigate(['/passenger']);
        },
        error => {
          console.error('Registration error:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
