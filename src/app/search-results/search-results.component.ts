import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  apiUrl = 'http://localhost:8080/rides/search';
  filterUrl = 'http://localhost:8080/rides/filter';
  carApiUrl = 'http://localhost:8080/driver/cars/';
  driverApiUrl = 'http://localhost:8080/admin/get-user/';
  rides: any[] = [];
  filters: any = {
    petAllowed: false,
    airConditionning: false,
    minPrice: null,
    maxPrice: null
  };
  allRides: any[] = [];
  showDriverDetails: number | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const searchParams = {
        startLocation: params['depart'],
        endLocation: params['destination'],
        nbrPassengers: params['passengers'],
        date: params['date']
      };
      this.fetchRideData(searchParams);
    });
  }

  fetchRideData(searchParams: any) {
    this.http.get<any[]>(this.apiUrl, { params: searchParams }).pipe(
      switchMap(rides => {
        this.allRides = rides; // Save all search results
        const carRequests = rides.map(ride =>
          this.http.get<any>(`${this.carApiUrl}${ride.car.id}`).pipe(
            map(car => ({ ...ride, car }))
          )
        );
        return forkJoin(carRequests);
      }),
      switchMap(ridesWithCars => {
        const driverRequests = ridesWithCars.map(ride =>
          this.http.get<any>(`${this.driverApiUrl}${ride.car.driverId}`).pipe(
            map(driverResponse => {
              const driver = driverResponse.ourUsers;
              const age = this.calculateAge(driver.birthDate); // Calculate age here
              return { ...ride, driver: { ...driver, age } }; // Add age to driver object
            })
          )
        );
        return forkJoin(driverRequests);
      })
    ).subscribe(
      data => {
        this.allRides = data; // Save all fetched rides before filtering
        this.rides = this.applyFilters(this.allRides); // Apply filters after fetching data
      },
      error => {
        console.error('Error fetching rides', error);
      }
    );
  }

  onFilterChange() {
    this.rides = this.applyFilters(this.allRides);
  }

  applyFilters(rides: any[]): any[] {
    if (!this.filters) return rides;
    return rides.filter(ride => {
      return (!this.filters.petAllowed || ride.petAllowed) &&
             (!this.filters.airConditionning || ride.airConditionning) &&
             (!this.filters.cigaretteAllowed || ride.cigaretteAllowed) &&
             (this.filters.minPrice === null || ride.price >= this.filters.minPrice) &&
             (this.filters.maxPrice === null || ride.price <= this.filters.maxPrice);
    });
  }

  calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  toggleDriverDetails(rideId: number) {
    this.showDriverDetails = this.showDriverDetails === rideId ? null : rideId;
  }

  getStarsArray(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    return [...Array(fullStars).fill(1), ...Array(halfStars).fill(0.5)];
  }

  bookNow(ride: any) {
    // Implement your booking logic here
    console.log('Booking ride:', ride);
  }

  getDriverImage(): string {
    // Replace with actual logic to fetch driver's image URL
    return 'https://via.placeholder.com/40';
  }
}
