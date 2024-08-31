import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bikeride-history',
  templateUrl: './bikeride-history.component.html',
  styleUrl: './bikeride-history.component.css'
})
export class BikerideHistoryComponent {
  bikeRides: any[] = [];
  newRide: any = {};
  currentRide: any = {};
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  driverId: number | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalItems: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.driverId = this.getDriverIdFromLocalStorage();
    if (this.driverId !== null) {
      this.fetchBikeRides();
    } else {
      console.error('Driver ID is not set in local storage.');
    }
  }

  getDriverIdFromLocalStorage(): number | null {
    const driverId = localStorage.getItem('userId');
    return driverId ? parseInt(driverId, 10) : null;
  }

  fetchBikeRides(): void {
    if (this.driverId === null) return;

    this.http.get<any[]>(`http://localhost:8080/bike-rides/creator/38`)
      .subscribe(data => {
        this.totalItems = data.length;
        this.updatePage();
      });
  }

  updatePage(): void {
    if (this.driverId === null) return;

    this.http.get<any[]>(`http://localhost:8080/bike-rides/creator/38`)
      .subscribe(data => {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.bikeRides = data.slice(startIndex, endIndex);
      });
  }

  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePage();
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.newRide = {}; // Clear form
  }

  addBikeRide(): void {
    if (this.driverId === null) {
      console.error('Driver ID is not available.');
      return;
    }

    this.newRide.creatorId = this.driverId;

    this.http.post('http://localhost:8080/driver/bikerides', this.newRide)
      .subscribe({
        next: () => {
          this.fetchBikeRides();
          this.closeAddModal();
        },
        error: (err) => {
          console.error('Error adding bike ride', err);
        }
      });
  }

  openEditModal(ride: any): void {
    if (!ride || !ride.id) {
      console.error('Invalid bike ride data:', ride);
      return;
    }
    this.currentRide = { ...ride }; // Copy ride data
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.currentRide = {}; // Clear ride data
  }

  updateBikeRide(): void {
    if (!this.currentRide.id) {
      console.error('Bike Ride ID is required for updating.');
      return;
    }

    this.http.put(`http://localhost:8080/bike-rides/${this.currentRide.id}`, this.currentRide)
      .subscribe({
        next: () => {
          this.fetchBikeRides();
          this.closeEditModal();
        },
        error: (err) => {
          console.error('Error updating bike ride', err);
        }
      });
  }

  deleteBikeRide(rideId: number): void {
    this.http.delete(`http://localhost:8080/driver/bikerides/${rideId}`)
      .subscribe(() => this.fetchBikeRides());
  }
}
