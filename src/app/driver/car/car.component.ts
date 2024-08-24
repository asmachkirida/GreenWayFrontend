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
  showModal: boolean = false;
  driverId: number = 19; // Static driver ID for now
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalItems: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCars();
  }

  fetchCars(): void {
    this.http.get<any[]>(`http://localhost:8080/driver/cars/driver/${this.driverId}`)
      .subscribe(data => {
        this.totalItems = data.length;
        this.updatePage();
      });
  }

  updatePage(): void {
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
    this.http.post('http://localhost:8080/driver/cars', this.newCar)
      .subscribe(() => {
        this.fetchCars();
        this.closeModal();
      });
  }

  editCar(car: any): void {
    // Handle car editing logic
  }

  deleteCar(carId: number): void {
    this.http.delete(`http://localhost:8080/driver/cars/${carId}`)
      .subscribe(() => this.fetchCars());
  }
}
