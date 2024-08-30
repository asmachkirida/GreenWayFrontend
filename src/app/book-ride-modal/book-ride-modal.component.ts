import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-ride-modal',
  templateUrl: './book-ride-modal.component.html',
  styleUrls: ['./book-ride-modal.component.css']
})
export class BookRideModalComponent {
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<BookRideModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  confirmBooking(): void {
    // Retrieve the user ID from localStorage
    const userId = localStorage.getItem('userId');
    
    if (userId) {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      // Step 1: Add the passenger to the ride
      const addPassengerUrl = `http://localhost:8080/rides/${this.data.rideId}/passengers`;
      this.http.post(addPassengerUrl, userId, { headers }).subscribe(
        () => {
          console.log('Passenger added to ride successfully');

          // Step 2: Calculate the remaining passengers and update the ride's status if necessary
          let remainingPassengers = this.data.ridenbrpassenger - this.data.nbrPassengers;
          let rideStatus = 'active'; // Default status

          if (remainingPassengers <= 0) {
            remainingPassengers = 0;
            rideStatus = 'completed'; // Mark ride as completed if no seats are left
          }

          // Step 3: Update the ride's passenger number and status
          const updatePassengersUrl = `http://localhost:8080/rides/${this.data.rideId}/update-passengers-status?nbrPassengers=${remainingPassengers}&status=${rideStatus}`;

          this.http.patch(updatePassengersUrl, null, { headers }).subscribe(
            () => {
              console.log('Ride passengers number and status updated successfully');

              // Step 4: Notify the driver
              const notifyDriverUrl = `http://localhost:8080/driver/notifications/create?passengerId=${userId}&driverId=${this.data.driverId}&message=Booking confirmed for ride ID: ${this.data.rideId}`;
              
              this.http.post(notifyDriverUrl, null, { headers }).subscribe(
                () => {
                  console.log('Driver notified successfully');
                  this.dialogRef.close();
                  this.router.navigate(['/passenger/rides-history']);
                },
                error => {
                  console.error('Error notifying the driver', error);
                }
              );
            },
            error => {
              console.error('Error updating ride passengers or status', error);
            }
          );
        },
        error => {
          console.error('Error adding passenger to ride', error);
        }
      );
    } else {
      console.error('User ID not found in localStorage');
    }
  }
}
