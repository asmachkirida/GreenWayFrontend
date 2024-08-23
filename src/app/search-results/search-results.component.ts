import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { BookRideModalComponent } from '../book-ride-modal/book-ride-modal.component';
declare var google: any;


@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  apiUrl = 'http://localhost:8080/rides/search';
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

  constructor(private http: HttpClient, private route: ActivatedRoute, private dialog: MatDialog) {}

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

  getStarsArray(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const decimal = rating % 1;
    let halfStar = 0;
  
    if (decimal >= 0.5) {
      halfStar = 1;
    }
  
    const emptyStars = 5 - fullStars - halfStar;
  
    const starsArray = [
      ...Array(fullStars).fill('full'),
      ...Array(halfStar).fill('half'),
      ...Array(emptyStars).fill('empty')
    ];
  
    return starsArray;
  }
  getDriverImage(): string {
    return 'https://via.placeholder.com/40';
  }

  bookNow(ride: any) {
    this.calculateDistance(ride.startLocation, ride.endLocation, (distance: string, duration: string) => {
      this.dialog.open(BookRideModalComponent, {
        data: {
          startLocation: ride.startLocation,
          endLocation: ride.endLocation,
          distance,
          duration,
          rideId: ride.id // Pass the ride ID here

        }
      });
    });
  }
  
  calculateDistance(origin: string, destination: string, callback: (distance: string, duration: string) => void) {
    const distanceService = new google.maps.DistanceMatrixService();
  
    const request = {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING
    };
  
    distanceService.getDistanceMatrix(request, (response: any, status: any) => {
      if (status === google.maps.DistanceMatrixStatus.OK) {
        const element = response.rows[0].elements[0];
        const distance = element.distance.text;
        const duration = element.duration.text;
        callback(distance, duration);
      } else {
        console.error('Error:', status);
        callback('N/A', 'N/A');
      }
    });
  }
  
}