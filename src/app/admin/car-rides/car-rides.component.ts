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
  selectedRide: any = null;
  showAddEditRideModal = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRides();
  }

  loadRides() {
    this.http.get<any[]>('http://localhost:8080/rides').subscribe(data => {
      this.totalPages = Math.ceil(data.length / this.pageSize);
      this.rides = data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
     // Fetch driver details for each ride
     this.rides.forEach(ride => {
      this.http.get<any>(`http://localhost:8080/driver/cars/${ride.carId}`).subscribe(car => {
        this.http.get<any>(`http://localhost:8080/admin/get-user/${car.driverId}`).subscribe(user => {
          ride.driverName = `${user.ourUsers.firstName} ${user.ourUsers.lastName}`;
        });
      });
    });
  });}

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
      this.http.delete(`http://localhost:8080/rides/${id}`).subscribe(() => {
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
      this.http.post('http://localhost:8080/admin/add-ride', this.selectedRide)
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
      this.http.put(`http://localhost:8080/rides/${this.selectedRide.id}`, this.selectedRide)
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

  exportData() {
    this.http.get<any[]>('http://localhost:8080/rides').subscribe(data => {
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
    a.download = 'car-rides.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  convertToCSV(data: any[]): string {
    const header = 'ID,Start Location,End Location,Date,Start Time,End Time,Price,Driver Name,Car Model\n';
    const rows = data.map(ride =>
      `${ride.id},${ride.startLocation},${ride.endLocation},${new Date(ride.date).toLocaleDateString()},${ride.startTime},${ride.endTime},${ride.price},${ride.driverName || 'N/A'},${ride.carModel || 'N/A'}`
    ).join('\n');
    return header + rows;
  }
}
