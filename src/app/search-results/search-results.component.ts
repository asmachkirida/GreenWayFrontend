import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  demoData = {
    trips: [
      {
        time: '17:30',
        duration: '10h10',
        startLocation: 'Neuilly-sur-Seine',
        endLocation: 'Nice',
        status: 'Available',
        driver: 'Nicolas',
        price: '71,29€',
        rating: 4.8,
        superDriver: true,
        instantBooking: true,
        maxSeats: 2
      },
      {
        time: '16:30',
        duration: '01:30',
        startLocation: 'Paris',
        endLocation: 'Nice',
        status: 'Complet',
        driver: 'Tayeb',
        price: '71,29€',
        rating: 4.8,
        superDriver: true,
        instantBooking: true,
        maxSeats: 2
      }
    ]
  };

  constructor() { }

  ngOnInit(): void {
  }

  getDriverImage(driver: string): string {
    // Placeholder logic for driver images
    return 'https://via.placeholder.com/40';
  }
}
