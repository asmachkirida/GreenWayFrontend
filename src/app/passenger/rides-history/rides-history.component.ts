import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rides-history',
  templateUrl: './rides-history.component.html',
  styleUrls: ['./rides-history.component.css']
})
export class RidesHistoryComponent implements OnInit {
  rides: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    this.http.get<any[]>(`http://localhost:8080/rides/passenger/${userId}`).subscribe(
      (response) => {
        this.rides = response;
      },
      (error) => {
        console.error('Error fetching rides history:', error);
      }
    );
  }


  openAddReviewPopup(rideId: number) {
    // Logic to open add review popup
    console.log('Add Review for Ride ID:', rideId);
  }

  openRateDriverPopup(rideId: number) {
    // Logic to open rate driver popup
    console.log('Rate Driver for Ride ID:', rideId);
  }
}
