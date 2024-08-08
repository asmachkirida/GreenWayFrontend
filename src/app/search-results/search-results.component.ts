import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  apiUrl = 'http://localhost:8080/rides';
  carApiUrl = 'http://localhost:8080/driver/cars/';
  driverApiUrl = 'http://localhost:8080/admin/get-user/';
  rides: any[] = []; 

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchRideData();
  }

  fetchRideData() {
    this.http.get<any[]>(this.apiUrl).pipe(
      switchMap(rides => {
        const carRequests = rides.map(ride => 
          this.http.get<any>(`${this.carApiUrl}${ride.carId}`).pipe(
            map(car => ({ ...ride, car }))
          )
        );
        return forkJoin(carRequests);
      }),
      switchMap(ridesWithCars => {
        const driverRequests = ridesWithCars.map(ride => 
          this.http.get<any>(`${this.driverApiUrl}${ride.car.driverId}`).pipe(
            map(driverResponse => {
              const driver = driverResponse.ourUsers; // Access the driver data correctly
              return { ...ride, driver };
            })
          )
        );
        return forkJoin(driverRequests);
      })
    ).subscribe(
      data => {
        this.rides = data.map(ride => ({
          ...ride,
          driver: {
            ...ride.driver,
            age: this.calculateAge(ride.driver.birthDate) // Calculate age
          }
        }));
        console.log('Final combined data:', data); // Log final combined data
      },
      error => {
        console.error('Error fetching rides', error);
      }
    );
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

  getDriverImage(): string {
    // Since no driver images are available, return a placeholder
    return 'https://via.placeholder.com/40';
  }
}
