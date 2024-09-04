import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bike-rides',
  templateUrl: './bike-rides.component.html',
  styleUrls: ['./bike-rides.component.css']
})
export class BikeRidesComponent implements OnInit {
  bikeRides: any[] = [];
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;
  selectedBikeRide: any = null;
  showAddEditBikeRideModal = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadBikeRides();
  }

  loadBikeRides() {
    this.http.get<any[]>('http://localhost:8080/bike-rides').subscribe(data => {
      this.totalPages = Math.ceil(data.length / this.pageSize);
      this.bikeRides = data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);

      // Fetch creator details for each bike ride
      this.bikeRides.forEach(ride => {
        this.http.get<any>(`http://localhost:8080/admin/get-user/${ride.creatorId}`).subscribe(user => {
          ride.creatorName = `${user.ourUsers.firstName} ${user.ourUsers.lastName}`;
        });
      });
    });
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBikeRides();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBikeRides();
    }
  }

  deleteBikeRide(id: number) {
    if (confirm('Are you sure you want to delete this bike ride?')) {
      this.http.delete(`http://localhost:8080/bike-rides/${id}`).subscribe(() => {
        this.loadBikeRides();
      }, error => {
        console.error('Error deleting bike ride:', error);
      });
    }
  }

  openAddEditBikeRideModal(bikeRide?: any) {
    this.selectedBikeRide = bikeRide ? { ...bikeRide } : {};
    this.showAddEditBikeRideModal = true;
  }

  closeAddEditBikeRideModal() {
    this.showAddEditBikeRideModal = false;
  }

  saveBikeRide() {
    if (!this.selectedBikeRide || !this.selectedBikeRide.id) {
      this.http.post('http://localhost:8080/admin/add-bike-ride', this.selectedBikeRide)
        .subscribe({
          next: () => {
            this.loadBikeRides();
            this.closeAddEditBikeRideModal();
          },
          error: (err) => {
            console.error('Error adding bike ride', err);
          }
        });
    } else {
      this.http.put(`http://localhost:8080/bike-rides/${this.selectedBikeRide.id}`, this.selectedBikeRide)
        .subscribe({
          next: () => {
            this.loadBikeRides();
            this.closeAddEditBikeRideModal();
          },
          error: (err) => {
            console.error('Error updating bike ride', err);
          }
        });
    }
  }

  exportData() {
    this.http.get<any[]>('http://localhost:8080/bike-rides').subscribe(data => {
      this.exportToCSV(data);
    }, error => {
      console.error('Error exporting data:', error);
    });
  }
  
  exportToCSV(data: any[]) {
    const csvData = this.convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bike-rides.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  convertToCSV(data: any[]): string {
    const header = 'ID,Date,Start Time,Start Location,End Location,Max Riders,Creator\n';
    const rows = data.map(ride =>
      `${ride.id},${new Date(ride.date).toLocaleDateString()},${ride.startTime},${ride.startLocation},${ride.endLocation},${ride.maxRiders},${ride.creatorName || 'N/A'}`
    ).join('\n');
    return header + rows;
  }
}
