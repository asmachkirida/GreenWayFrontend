import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-car-rides',
  templateUrl: './car-rides.component.html',
  styleUrls: ['./car-rides.component.css']
})
export class CarRidesComponent implements OnInit {
  rides: any[] = [];
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;
  searchTerm = '';
  selectedRide: any = null;
  showAddEditRideModal = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRides();
  }

  loadRides() {
    const searchQuery = this.searchTerm.trim() ? `?searchTerm=${encodeURIComponent(this.searchTerm.trim())}` : '';
    this.http.get<any[]>(`http://localhost:8080/admin/rides/search${searchQuery}`).subscribe(data => {
      this.totalPages = Math.ceil(data.length / this.pageSize);
      this.rides = data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    });
  }

  searchRides() {
    this.currentPage = 1;
    this.loadRides();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadRides();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadRides();
    }
  }

  deleteRide(id: number) {
    if (confirm('Are you sure you want to delete this ride?')) {
      this.http.delete(`http://localhost:8080/admin/delete-ride/${id}`).subscribe(() => {
        this.loadRides(); 
      }, error => {
        console.error('Error deleting ride:', error);
      });
    }
  }

  openAddEditRideModal(ride?: any) {
    this.selectedRide = ride ? { ...ride } : {}; 
    this.showAddEditRideModal = true;
  }

  closeAddEditRideModal() {
    this.showAddEditRideModal = false;
  }

  saveRide() {
    if (!this.selectedRide || !this.selectedRide.id) {
      this.http.post(`http://localhost:8080/admin/add-ride`, this.selectedRide)
        .subscribe({
          next: () => {
            this.loadRides();
            this.closeAddEditRideModal();
          },
          error: (err) => {
            console.error('Error adding ride', err);
          }
        });
    } else {
      this.http.put(`http://localhost:8080/admin/update-ride/${this.selectedRide.id}`, this.selectedRide)
        .subscribe({
          next: () => {
            this.loadRides();
            this.closeAddEditRideModal();
          },
          error: (err) => {
            console.error('Error updating ride', err);
          }
        });
    }
  }
}
