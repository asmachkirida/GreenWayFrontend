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
        // Filter out bike rides created by the current user
        this.bikeRides = data.filter(ride => ride.creatorId !== this.userId);
      });
  }

  participateInBikeRide(bikeRideId: number): void {
    if (this.userId !== null) {
      this.http.post(`http://localhost:8080/bike-rides/${bikeRideId}/participants/${this.userId}`, {})
        .subscribe({
          next: () => {
            alert('Successfully joined the bike ride!');
            // Optionally, you can refresh the list or update the UI here
          },
          error: (err) => {
            console.error('Error joining bike ride', err);
          }
        });
    }
  }
}
