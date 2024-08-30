import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rides-history',
  templateUrl: './rides-history.component.html',
  styleUrls: ['./rides-history.component.css']
})
export class RidesHistoryComponent implements OnInit {
  rides: any[] = [];
  reviewDetails: string = '';
  selectedRideId: number | null = null;
  showAddReviewModal: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    this.http.get<any[]>(`http://localhost:8080/rides/passenger/${userId}`).subscribe(
      (response) => {
        this.rides = response;
      },
      (error) => {
        console.error('Error fetching rides history:', error);
      }
    );
  }

  openAddReviewPopup(rideId: number): void {
    this.selectedRideId = rideId;
    this.showAddReviewModal = true;
  }

  closeAddReviewModal(): void {
    this.showAddReviewModal = false;
    this.reviewDetails = '';
  }

  submitReview(): void {
    if (this.selectedRideId) {
      const review = {
        details: this.reviewDetails,
        rideId: this.selectedRideId
      };
      this.http.post('http://localhost:8080/passenger/reviews', review).subscribe(
        () => {
          this.closeAddReviewModal();
          this.ngOnInit(); // Refresh the rides history
        },
        (error) => {
          console.error('Error submitting review:', error);
        }
      );
    }
  }
}
