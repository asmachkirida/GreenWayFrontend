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
  showUpdateRatingModal: boolean = false;
  selectedDriverId: number | null = null;
  newRating: number | null = null;

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    this.http.get<any[]>(`http://localhost:8080/rides/passenger/${userId}`).subscribe(
      (response) => {
        this.rides = response;
        
        // Fetch driver ID for each ride based on carId
        this.rides.forEach(ride => {
          this.getDriverIdByCarId(ride.carId);
        });
      },
      (error) => {
        console.error('Error fetching rides history:', error);
      }
    );
  }
  

  private getDriverIdByCarId(carId: number): void {
    this.http.get<any>(`http://localhost:8080/driver/cars/${carId}`).subscribe(
      (response) => {
        // Update rides with driverId
        this.rides.forEach(ride => {
          if (ride.carId === carId) {
            ride.driverId = response.driverId; // Add driverId to the ride
          }
        });
      },
      (error) => {
        console.error('Error fetching driver by carId:', error);
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

  openUpdateRatingModal(driverId: number): void {
    this.selectedDriverId = driverId;
    this.showUpdateRatingModal = true;
  }

  closeUpdateRatingModal(): void {
    this.showUpdateRatingModal = false;
    this.newRating = null;
  }

  submitRating(): void {
    console.log("triggered");
    console.log(this.selectedDriverId);
    console.log(this.newRating);
    if (this.selectedDriverId != null && this.newRating != null) {
      console.log("triggered x2x2x2x2");
      console.log(this.selectedDriverId);
      console.log(this.newRating);

      this.http.put(`http://localhost:8080/admin/${this.selectedDriverId}/rating`, null, {
        params: { newRating: this.newRating.toString() }
      }).subscribe(
        () => {
          alert('Rating updated successfully');
          this.closeUpdateRatingModal();
          this.ngOnInit(); // Refresh the rides history
        },
        (error) => {
          alert('Error updating rating');
          console.error(error);
        }
      );
    }
  }


  
}
