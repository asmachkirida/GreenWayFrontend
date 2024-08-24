import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  cars: any[] = [];
  newCar: any = {};
  currentCar: any = {};
  showModal: boolean = false;
  showEditCarModal: boolean = false;
  driverId: number | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalItems: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.driverId = this.getDriverIdFromLocalStorage(); 
    if (this.driverId !== null) {
      this.fetchCars();
    } else {
      console.error('Driver ID is not set in local storage.');
    }
  }

  getDriverIdFromLocalStorage(): number | null {
    const driverId = localStorage.getItem('userId');
    return driverId ? parseInt(driverId, 10) : null;
  }

  fetchCars(): void {
    if (this.driverId === null) return;

    this.http.get<any[]>(`http://localhost:8080/driver/cars/driver/${this.driverId}`)
      .subscribe(data => {
        this.totalItems = data.length;
        this.updatePage();
      });
  }

  updatePage(): void {
    if (this.driverId === null) return;

    this.http.get<any[]>(`http://localhost:8080/driver/cars/driver/${this.driverId}`)
      .subscribe(data => {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.cars = data.slice(startIndex, endIndex);
      });
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updatePage();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updatePage();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.newCar = {}; // Clear form
  }

  addCar(): void {
    if (this.driverId === null) {
      console.error('Driver ID is not available.');
      return;
    }

    this.newCar.driverId = this.driverId;

    this.http.post('http://localhost:8080/driver/cars', this.newCar)
      .subscribe({
        next: () => {
          this.fetchCars();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error adding car', err);
        }
      });
  }

  openEditCarModal(car: any): void {
    if (!car || !car.id) {
      console.error('Invalid car data:', car);
      return;
    }
    this.currentCar = { ...car }; // Copy car data
    this.showEditCarModal = true;
  }

  closeEditCarModal(): void {
    this.showEditCarModal = false;
    this.currentCar = {}; // Clear car data
  }

  updateCar(): void {
    if (!this.currentCar.id) {
      console.error('Car ID is required for updating.');
      return;
    }

    this.http.put(`http://localhost:8080/driver/cars/${this.currentCar.id}`, this.currentCar)
      .subscribe({
        next: () => {
          this.fetchCars();
          this.closeEditCarModal();
        },
        error: (err) => {
          console.error('Error updating car', err);
        }
      });
  }

  deleteCar(carId: number): void {
    this.http.delete(`http://localhost:8080/driver/cars/${carId}`)
      .subscribe(() => this.fetchCars());
  }
}
