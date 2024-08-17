import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare var google: any;

interface RegisterResponse {
  token: string; // Adjust based on your actual response structure
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  autocompleteCity: any;
  hide: boolean = true; // Added hide property

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      gender: ['', Validators.required],
      role: ['PASSENGER', Validators.required], // Default role set to 'PASSENGER'
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
    this.hide = !this.hide; // Toggle hide value
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;
      console.log('Form Submitted:', formData);

      this.http.post<RegisterResponse>('http://localhost:8080/auth/register-passenger', {
        ...formData,
        membership: 'Normal' // Default membership
      }).subscribe(
        response => {
          console.log('Registration successful:', response);
          
          // Save the token to local storage or a service
          if (response.token) {
            localStorage.setItem('authToken', response.token);
          }

          // Navigate to the profile page
          this.router.navigate(['/passenger']); // Adjust path as needed
        },
        error => {
          console.error('Registration error:', error);
          // Handle different error scenarios
          if (error.status === 401) {
            console.error('Unauthorized');
          } else if (error.status === 404) {
            console.error('Not Found');
          } else {
            console.error('Error:', error.message);
          }
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
