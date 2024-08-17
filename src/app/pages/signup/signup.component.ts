import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var google: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  autocompleteCity: any;
  hide: boolean = true; // Added hide property

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
      console.log('Form Submitted', this.signupForm.value);
    }
  }
}
