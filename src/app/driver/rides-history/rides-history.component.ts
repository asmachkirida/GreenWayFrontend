import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Ride = {
  id: number;
  startLocation: string;
  endLocation: string;
  date: Date;
  startTime: string;
  distance: number;
  cigaretteAllowed: boolean;
  airConditionning: boolean;
  petAllowed: boolean;
  nbrPassengers: number;
  status: string;
  carId: number;
  price: number;
};

export type Car = {
  id: number;
  model: string;
  brand: string;
};

@Component({
  selector: 'app-rides-history',
  templateUrl: './rides-history.component.html',
  styleUrls: ['./rides-history.component.css']
})
export class RidesHistoryComponent implements OnInit {
  rides: Ride[] = [];
  pagedRides: Ride[] = [];
  currentPage = 1;
  cars: Car[] = []; // Store the user's cars here
  pageSize = 8;
  totalPages = 0;
  showAddRideModal = false;
  showEditRideModal = false;

  newRide: Ride = {
    id: 0,
    startLocation: '',
    endLocation: '',
    date: new Date(),
    startTime: '',
    distance: 0,
    cigaretteAllowed: false,
    airConditionning: false,
    petAllowed: false,
    nbrPassengers: 0,
    status: 'scheduled', // Default value
    carId: 0,
    price: 0
  };

  currentRide: Ride = {
    id: 0,
    startLocation: '',
    endLocation: '',
    date: new Date(),
    startTime: '',
    distance: 0,
    cigaretteAllowed: false,
    airConditionning: false,
    petAllowed: false,
    nbrPassengers: 0,
    status: 'scheduled', // Default value
    carId: 0,
    price: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchRides();
    this.fetchCars(); // Fetch the cars when the component initializes
  }

  fetchRides() {
    this.http.get<Ride[]>('http://localhost:8080/rides').subscribe(data => {
      this.rides = data;
      this.totalPages = Math.ceil(this.rides.length / this.pageSize);
      this.updatePage();
    });
  }

  fetchCars() {
    this.http.get<Car[]>('http://localhost:8080/driver/cars/driver/19').subscribe(data => {
      this.cars = data; // Store the fetched cars
    });
  }

  updatePage() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedRides = this.rides.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }

  openAddRideModal() {
    this.showAddRideModal = true;
  }

  closeAddRideModal() {
    this.showAddRideModal = false;
    this.newRide = {
      id: 0,
      startLocation: '',
      endLocation: '',
      date: new Date(),
      startTime: '',
      distance: 0,
      cigaretteAllowed: false,
      airConditionning: false,
      petAllowed: false,
      nbrPassengers: 0,
      status: 'scheduled',
      carId: 0,
      price: 0
    };
  }

  addRide() {
    this.http.post<Ride>('http://localhost:8080/rides', this.newRide).subscribe({
      next: () => {
        this.fetchRides();
        this.closeAddRideModal();
      },
      error: (err) => console.error('Error adding ride', err)
    });
  }

  openEditRideModal(ride: Ride) {
    this.currentRide = { ...ride };
    this.showEditRideModal = true;
  }

  closeEditRideModal() {
    this.showEditRideModal = false;
    this.currentRide = {
      id: 0,
      startLocation: '',
      endLocation: '',
      date: new Date(),
      startTime: '',
      distance: 0,
      cigaretteAllowed: false,
      airConditionning: false,
      petAllowed: false,
      nbrPassengers: 0,
      status: 'scheduled',
      carId: 0,
      price: 0
    };
  }

  updateRide() {
    this.http.put<Ride>(`http://localhost:8080/rides/${this.currentRide.id}`, this.currentRide).subscribe({
      next: () => {
        this.fetchRides();
        this.closeEditRideModal();
      },
      error: (err) => console.error('Error updating ride', err)
    });
  }

  deleteRide(rideId: number) {
    this.http.delete(`http://localhost:8080/rides/${rideId}`).subscribe(() => this.fetchRides());
  }
}
