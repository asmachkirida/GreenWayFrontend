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
      const bookingUrl = `http://localhost:8080/rides/${this.data.rideId}/passengers`;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post(bookingUrl, userId, { headers }).subscribe(
        () => {
          console.log('Booking confirmed successfully for ride ID:', this.data.rideId);

          // Prepare the notification message
          const message = 'A new passenger just booked a ride with you, contact them as soon as possible';
          const notificationUrl = `http://localhost:8080/driver/notifications/create?passengerId=${userId}&driverId=${this.data.driverId}&message=${encodeURIComponent(message)}`;

          console.log('Sending notification with the following data:', {
            passengerId: userId,
            driverId: this.data.driverId,
            message: message
          });

          // Send the notification
          this.http.post(notificationUrl, {}, { headers }).subscribe(
            () => {
              console.log('Notification sent successfully to driver ID:', this.data.driverId);
              this.dialogRef.close();
              this.router.navigate(['/passenger/rides-history']);
            },
            error => {
              console.error('Error sending notification', error);
            }
          );
        },
        error => {
          console.error('Error booking ride', error);
        }
      );
    } else {
      console.error('User ID not found in localStorage');
    }
  }
}
