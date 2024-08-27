import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Renderer2, ElementRef ,ViewChild, AfterViewChecked} from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

declare var google: any;

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
export class RidesHistoryComponent implements OnInit , AfterViewInit ,AfterViewChecked  {
  @ViewChild('startLocation') startLocationInput!: ElementRef;
  @ViewChild('endLocation') endLocationInput!: ElementRef;
  
  rides: Ride[] = [];
  pagedRides: Ride[] = [];
  currentPage = 1;
  cars: Car[] = []; // Store the user's cars here
  pageSize = 8;
  totalPages = 0;
  showAddRideModal = false;
  showEditRideModal = false;
  private autocompleteInitialized = false;

  private apiUrl = 'http://localhost:8080/rides'; // API endpoint
  selectedCarId: number = 0; // Track selected car ID


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


  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}


  ngOnInit() {
    this.fetchRides();
    this.fetchCars(); // Fetch the cars when the component initializes
  }

  ngAfterViewInit() {
    if (this.startLocationInput && this.endLocationInput) {
      this.loadGoogleMaps();
    } else {
      console.error('Input elements are not available during AfterViewInit.');
    }
  }
  

  ngAfterViewChecked() {
    if (this.startLocationInput && this.endLocationInput && !this.autocompleteInitialized) {
      this.autocompleteInitialized = true;
      this.initAutocomplete();
    }
  }
  

  loadGoogleMaps() {
    if (typeof google !== 'undefined') {
      this.initAutocomplete();
    } else {
      (window as any)['initMap'] = () => this.initAutocomplete();
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCbXyLXLuR28SIid6xOTLvfm4igpYM4r_o&libraries=places&callback=initMap';
      document.body.appendChild(script);
    }
  }

  initAutocomplete() {
    if (this.startLocationInput && this.endLocationInput) {
      new google.maps.places.Autocomplete(this.startLocationInput.nativeElement);
      new google.maps.places.Autocomplete(this.endLocationInput.nativeElement);
    } else {
      console.error('Input elements not found or not instances of HTMLInputElement');
    }
  }
  

  fetchRides() {
    this.http.get<Ride[]>('http://localhost:8080/rides').subscribe(data => {
      this.rides = data;
      this.totalPages = Math.ceil(this.rides.length / this.pageSize);
      this.updatePage();
    });
  }
  fetchCars() {
    // Get the userId from local storage
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.http.get<Car[]>(`http://localhost:8080/driver/cars/driver/${userId}`).subscribe(data => {
        this.cars = data; // Store the fetched cars
      }, error => {
        console.error('Error fetching cars:', error);
      });
    } else {
      console.error('User ID not found in local storage');
    }
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
    // Prepare the data to be sent
    const rideData = {
      startLocation: this.newRide.startLocation,
      endLocation: this.newRide.endLocation,
      date: this.newRide.date,
      startTime: this.newRide.startTime,
      distance: this.newRide.distance,
      price: this.newRide.price,
      cigaretteAllowed: this.newRide.cigaretteAllowed,
      airConditionning: this.newRide.airConditionning,
      petAllowed: this.newRide.petAllowed,
      nbrPassengers: this.newRide.nbrPassengers,
      status: this.newRide.status
      // Do not include carId here, it will be part of the URL
    };
  
    const selectedCarId = this.newRide.carId; // Replace this with your actual logic to get the selected car ID

    // Construct the URL with carId as a query parameter
    const url = `${this.apiUrl}?carId=${selectedCarId}`;
  
    // Log the URL and carId being sent
    console.log('URL with query parameter:', url);
    console.log('Car ID being sent:', selectedCarId);
    console.log('Data being sent:', rideData);
  
    // Log the data being sent
    console.log('Sending data:', rideData);
  
    // Make the HTTP POST request
    this.http.post(url, rideData)
      .pipe(
        catchError(error => {
          console.error('Error adding ride:', error);
          return of(null); // Return a fallback observable
        })
      )
      .subscribe(
        response => {
          console.log('Ride added successfully:', response);
          // Optionally handle successful response here
        },
        error => {
          console.error('Error adding ride:', error);
        }
      );
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
