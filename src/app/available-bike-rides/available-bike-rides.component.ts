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

  userLocation: string | null = null;

  ngOnInit(): void {
    this.userId = this.getUserIdFromLocalStorage();
    if (this.userId !== null) {
      this.getUserLocation();
    } else {
      console.error('User ID is not set in local storage.');
    }
  }
  
  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.reverseGeocode(lat, lon);
        },
        error => {
          console.error('Error getting user location', error);
          this.fetchAvailableBikeRides(); // Proceed without location if there's an error
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.fetchAvailableBikeRides(); // Proceed without location
    }
  }

  reverseGeocode(lat: number, lon: number): void {

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;

    this.http.get(url).subscribe((response: any) => {
      if (response && response.address) {
        this.userLocation = response.address.city || response.address.town || response.address.village || 'Unknown';
        console.log('User Location:', this.userLocation); // Display location in console
        this.fetchAvailableBikeRides();
      } else {
        console.error('Unable to get a readable address from reverse geocoding.');
        this.userLocation = 'Unknown'; // Use a default or unknown value
        console.log('User Location:', this.userLocation); // Display location in console
        this.fetchAvailableBikeRides();
      }
    }, error => {
      console.error('Error in reverse geocoding', error);
      this.userLocation = 'Unknown'; // Use a default or unknown value
      console.log('User Location:', this.userLocation); // Display location in console
      this.fetchAvailableBikeRides();
    });
  }
  

  getUserIdFromLocalStorage(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  inMyArea: boolean = false;
  everywhere: boolean = true;
  
  fetchAvailableBikeRides(): void {
    this.http.get<any[]>('http://localhost:8080/bike-rides')
      .subscribe(data => {
        this.bikeRides = data
          .filter(ride => ride.creatorId !== this.userId && ride.maxRiders > 0)
          .filter(ride => {
            if (this.everywhere) return true;
            if (this.inMyArea && this.userLocation) {
              return ride.startLocation.includes(this.userLocation);
            }
            return false;
          });
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
