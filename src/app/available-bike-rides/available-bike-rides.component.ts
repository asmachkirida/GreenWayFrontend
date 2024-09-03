import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-available-bike-rides',
  templateUrl: './available-bike-rides.component.html',
  styleUrls: ['./available-bike-rides.component.css']
})
export class AvailableBikeRidesComponent implements OnInit {
  bikeRides: any[] = [];
  userId: number | null = null;
  creatorDetails: any = {};

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 3;

  // Modal variables
  showModal: boolean = false;
  selectedBikeRideId: number | null = null;

  modalMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.userId = this.getUserIdFromLocalStorage();
    if (this.userId !== null) {
      this.fetchAvailableBikeRides();
    } else {
      console.error('User ID is not set in local storage.');
    }
  }

  getUserIdFromLocalStorage(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  fetchAvailableBikeRides(): void {
    this.http.get<any[]>('http://localhost:8080/bike-rides')
      .subscribe(data => {
        this.bikeRides = data.filter(ride => ride.creatorId !== this.userId);
        this.bikeRides.forEach(bikeRide => {
          this.fetchCreatorDetails(bikeRide.creatorId);
        });
      });
  }

  openConfirmationModal(bikeRideId: number): void {
    this.selectedBikeRideId = bikeRideId;
    this.modalMessage = 'Are you sure you want to book a place in this bike ride?';
    this.showModal = true;
  }

  confirmBooking(): void {
    if (this.selectedBikeRideId !== null && this.userId !== null) {
      this.http.post(`http://localhost:8080/bike-rides/${this.selectedBikeRideId}/participants/${this.userId}`, {})
        .subscribe({
          next: () => {
            console.log('Successfully joined the bike ride!');
            this.showModal = false;
            this.fetchAvailableBikeRides(); // Refresh the list
          },
          error: (err) => {
            console.error('Error joining bike ride', err);
          }
        });
    }
  }

  cancelBooking(): void {
    this.showModal = false;
  }

  fetchCreatorDetails(creatorId: number) {
    if (!this.creatorDetails[creatorId]) {
      this.http.get(`http://localhost:8080/admin/get-user/${creatorId}`).subscribe((data: any) => {
        this.creatorDetails[creatorId] = data.ourUsers;
      });
    }
  }
}
