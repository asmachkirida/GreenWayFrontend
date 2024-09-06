import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchReviews();
  }

  fetchReviews(): void {
    this.http.get('http://localhost:8080/passenger/reviews').subscribe((reviews: any) => {
      reviews.forEach((review: any) => {
        this.http.get(`http://localhost:8080/rides/${review.rideId}`).subscribe((ride: any) => {
          // We use "Green Way User" instead of the actual passenger name
          this.reviews.push({
            details: review.details,
            userName: 'Green Way User'
          });
        });
      });
    });
  }
}
