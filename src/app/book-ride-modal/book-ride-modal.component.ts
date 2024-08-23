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
      const url = `http://localhost:8080/rides/${this.data.rideId}/passengers`;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post(url, userId, { headers }).subscribe(
        () => {
          this.dialogRef.close();
          // Optionally, redirect or update UI
       //   this.router.navigate(['/confirmation']); // Example: Redirect to a confirmation page
        },
        error => {
          console.error('Error booking ride', error);
          // Handle error (e.g., show an error message)
        }
      );
    } else {
      console.error('User ID not found in localStorage');
      // Handle missing user ID scenario
    }
  }
}
