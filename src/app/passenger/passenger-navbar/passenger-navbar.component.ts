import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-passenger-navbar',
  templateUrl: './passenger-navbar.component.html',
  styleUrls: ['./passenger-navbar.component.css']
})
export class PassengerNavbarComponent implements OnInit {
  currentDate: string = ''; // Initialize with an empty string

  ngOnInit(): void {
    this.currentDate = this.getFormattedDate(new Date());
  }

  getFormattedDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const day = date.getDate();
    return formattedDate.replace(day.toString(), `${day}${this.getOrdinalSuffix(day)}`);
  }

  getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }
}
