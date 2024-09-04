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
  showEditCarModal = false;
  selectedCar: any = null;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCars();
  }

  loadCars() {
    const searchQuery = this.searchTerm.trim() ? `?brand=${encodeURIComponent(this.searchTerm.trim())}` : '';
    this.http.get<any[]>(`http://localhost:8080/driver/cars/search${searchQuery}`).subscribe(data => {
      this.cars = data;
 
      this.updateCarsWithDriverNames();
      this.totalPages = Math.ceil(data.length / this.pageSize);
      this.cars = data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
 
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






  exportData() {
    this.http.get<any[]>(`http://localhost:8080/driver/cars`).subscribe(data => {
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
    a.download = 'cars.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  convertToCSV(data: any[]): string {
    const header = 'ID,Brand,Model,Capacity,License Plate,Color,Driver Name\n';
    const rows = data.map(car =>
      `${car.id},${car.brand},${car.model},${car.capacity},${car.licensePlate},${car.color},${this.drivers[car.driverId] || 'Unknown Driver'}`
    ).join('\n');
    return header + rows;
  }


  openEditCarModal(car: any) {
    this.selectedCar = { ...car };
    this.showEditCarModal = true;
  }

  closeEditCarModal() {
    this.showEditCarModal = false;
  }

  updateCar(): void {
    if (!this.selectedCar || !this.selectedCar.id) {
      console.error('Car ID is required for updating.');
      return;
    }
  
    const carData = {
      model: this.selectedCar.model,
      licensePlate: this.selectedCar.licensePlate,
      capacity: this.selectedCar.capacity,
      brand: this.selectedCar.brand,
      color: this.selectedCar.color,
      driverId: this.selectedCar.driverId // Assuming driverId is the only necessary reference
    };
  
    console.log('Data being sent to update the car:', carData);
  
    this.http.put(`http://localhost:8080/driver/cars/${this.selectedCar.id}`, carData)
      .subscribe({
        next: () => {
          this.loadCars(); // Reload the car list
          this.closeEditCarModal(); // Close the modal
          console.log("done!!!");
          this.loadCars(); // Reload the car list

        },
        error: (err) => {
          console.error('Error updating car:', err);
        }
      });
  }
  
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCars();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCars();
    }
  }

  
}
