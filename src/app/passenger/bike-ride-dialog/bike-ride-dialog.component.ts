import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

declare var google: any;

@Component({
  selector: 'app-bike-ride-dialog',
  templateUrl: './bike-ride-dialog.component.html',
  styleUrls: ['./bike-ride-dialog.component.css']
})
export class BikeRideDialogComponent implements OnInit, OnDestroy {
  bikeRideForm: FormGroup;
  autocompleteStart: any;
  autocompleteEnd: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BikeRideDialogComponent>,
    private http: HttpClient
  ) {
    this.bikeRideForm = this.fb.group({
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      maxRiders: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.initAutocomplete();
  }

  ngOnDestroy(): void {
    if (this.autocompleteStart) {
      google.maps.event.clearInstanceListeners(this.autocompleteStart);
    }
    if (this.autocompleteEnd) {
      google.maps.event.clearInstanceListeners(this.autocompleteEnd);
    }
  }

  initAutocomplete(): void {
    const startInput = document.getElementById('startLocation') as HTMLInputElement;
    const endInput = document.getElementById('endLocation') as HTMLInputElement;

    if (google && google.maps && google.maps.places) {
      this.autocompleteStart = new google.maps.places.Autocomplete(startInput, { types: ['geocode'] });
      this.autocompleteEnd = new google.maps.places.Autocomplete(endInput, { types: ['geocode'] });

      this.autocompleteStart.addListener('place_changed', () => {
        const place = this.autocompleteStart.getPlace();
        if (place && place.formatted_address) {
          this.bikeRideForm.patchValue({ startLocation: place.formatted_address });
        }
      });

      this.autocompleteEnd.addListener('place_changed', () => {
        const place = this.autocompleteEnd.getPlace();
        if (place && place.formatted_address) {
          this.bikeRideForm.patchValue({ endLocation: place.formatted_address });
        }
      });
    } else {
      console.error('Google Maps API is not loaded');
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  createBikeRide(): void {
    if (this.bikeRideForm.valid) {
      const creatorId = localStorage.getItem('userId');
      if (creatorId) {
        const rideData = {
          ...this.bikeRideForm.value,
          creatorId: parseInt(creatorId, 10) 
        };

        this.http.post('http://localhost:8080/bike-rides', rideData).subscribe(
          response => {
            console.log('Bike ride created successfully:', response);
            this.dialogRef.close(); 
          },
          error => {
            console.error('Error creating bike ride:', error);
          }
        );
      } else {
        console.error('Creator ID not found in localStorage');
      }
    }
  }
}