import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {
  cars: any[] = [];
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;
  searchTerm = '';
  drivers: { [key: number]: string } = {}; // Store driver full names by ID

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCars();
  }

  loadCars() {
    const searchQuery = this.searchTerm.trim() ? `?brand=${encodeURIComponent(this.searchTerm.trim())}` : '';
    this.http.get<any[]>(`http://localhost:8080/driver/cars/search${searchQuery}`).subscribe(data => {
      this.cars = data;
      this.totalPages = Math.ceil(this.cars.length / this.pageSize);
      this.updateCarsWithDriverNames();
    });
  }

  updateCarsWithDriverNames() {
    // Fetch driver's full names for all cars
    const driverIds = Array.from(new Set(this.cars.map(car => car.driverId)));
    driverIds.forEach(driverId => {
      this.fetchDriverFullName(driverId);
    });

    // Update pagination
    this.updatePagination();
  }

  fetchDriverFullName(driverId: number) {
    this.http.get<any>(`http://localhost:8080/admin/get-user/${driverId}`).subscribe(response => {
      if (response.statusCode === 200) {
        const user = response.ourUsers;
        const fullName = `${user.firstName} ${user.lastName}`;
        this.drivers[driverId] = fullName;
        // Update car data with driver full names
        this.updateCarsWithDriverNamesInUI();
      } else {
        console.error(`Error fetching user data for ID ${driverId}: ${response.message}`);
      }
    });
  }

  updateCarsWithDriverNamesInUI() {
    // Update car objects with driver full names
    this.cars = this.cars.map(car => ({
      ...car,
      driverName: this.drivers[car.driverId] || 'Unknown Driver'
    }));
    // Trigger UI update
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.cars.length / this.pageSize);
    this.cars = this.cars.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
  }

  searchCars() {
    this.currentPage = 1;
    this.loadCars();
  }

  editCar(id: number) {
    console.log('Edit car', id);
  }

  deleteCar(id: number) {
    if (confirm('Are you sure you want to delete this car?')) {
      this.http.delete(`http://localhost:8080/driver/cars/${id}`).subscribe(() => {
        this.loadCars();
      }, error => {
        console.error('Error deleting car:', error);
      });
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  exportData() {
    console.log('Export data');
  }
}
