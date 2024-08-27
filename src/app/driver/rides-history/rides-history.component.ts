import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Renderer2, ElementRef ,ViewChild, AfterViewChecked} from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Observable } from 'rxjs';

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
      const startAutocomplete = new google.maps.places.Autocomplete(this.startLocationInput.nativeElement);
      const endAutocomplete = new google.maps.places.Autocomplete(this.endLocationInput.nativeElement);
  
      startAutocomplete.addListener('place_changed', () => {
        const place = startAutocomplete.getPlace();
        if (place.formatted_address) {
          console.log('Start Location selected:', place.formatted_address);
          this.newRide.startLocation = place.formatted_address;
        } else {
          console.warn('No formatted address available for the start location.');
        }
      });
  
      endAutocomplete.addListener('place_changed', () => {
        const place = endAutocomplete.getPlace();
        if (place.formatted_address) {
          console.log('End Location selected:', place.formatted_address);
          this.newRide.endLocation = place.formatted_address;
        } else {
          console.warn('No formatted address available for the end location.');
        }
      });
    } else {
      console.error('Input elements not found or not instances of HTMLInputElement');
    }
  }
  
  

  fetchRides() {
    const driverId = localStorage.getItem('userId');
    if (driverId) {
      this.http.get<Ride[]>(`http://localhost:8080/rides/driver/${driverId}`).subscribe(data => {
        this.rides = data;
        this.totalPages = Math.ceil(this.rides.length / this.pageSize);
        this.updatePage();
      }, error => {
        console.error('Error fetching rides:', error);
      });
    } else {
      console.error('Driver ID not found in local storage');
    }
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
  getLatLng(address: string): Observable<any> {
    const encodedAddress = encodeURIComponent(address);
    const apiKey = 'AIzaSyCbXyLXLuR28SIid6xOTLvfm4igpYM4r_o'; // Replace with your Google Maps API Key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
    
    return this.http.get<any>(url);
  }
  
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.degToRad(lat2 - lat1);
    const dLon = this.degToRad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  degToRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
  












  addRide() {
    const startAddress = this.newRide.startLocation;
    const endAddress = this.newRide.endLocation;
  
    // Fetch lat/lng for start and end locations
    this.getLatLng(startAddress).subscribe(startResponse => {
      const startLat = startResponse.results[0].geometry.location.lat;
      const startLng = startResponse.results[0].geometry.location.lng;
  
      this.getLatLng(endAddress).subscribe(endResponse => {
        const endLat = endResponse.results[0].geometry.location.lat;
        const endLng = endResponse.results[0].geometry.location.lng;
  
        // Calculate distance
        const distance = this.calculateDistance(startLat, startLng, endLat, endLng);
  
        // Prepare the ride data
        const rideData = {
          startLocation: startAddress,
          endLocation: endAddress,
          date: this.newRide.date,
          startTime: this.newRide.startTime,
          distance: distance, // Set the actual distance here
          price: this.newRide.price,
          cigaretteAllowed: this.newRide.cigaretteAllowed,
          airConditionning: this.newRide.airConditionning,
          petAllowed: this.newRide.petAllowed,
          nbrPassengers: this.newRide.nbrPassengers,
          status: this.newRide.status
        };
  
        const selectedCarId = this.newRide.carId;
        const url = `${this.apiUrl}?carId=${selectedCarId}`;
  
        this.http.post(url, rideData)
          .pipe(
            catchError(error => {
              console.error('Error adding ride:', error);
              return of(null);
            })
          )
          .subscribe(
            response => {
              console.log('Ride added successfully:', response);
              this.fetchRides();
              this.closeAddRideModal();
            },
            error => {
              console.error('Error adding ride:', error);
            }
          );
      });
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
