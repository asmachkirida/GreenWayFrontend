import { Component } from '@angular/core';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
  reviews = [
    { text: "Amazing service, I loved the bike ride experience!", user: "Jane Doe" },
    { text: "Great app, easy to use and very helpful.", user: "John Smith" },
    // Add more reviews as needed
  ];
}
