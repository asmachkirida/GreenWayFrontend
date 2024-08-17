import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  services = [
    {
      image: 'assets/ride-sharing.jpg',
      title: 'Ride Sharing',
      description: 'Share your ride with others and reduce travel costs while minimizing your carbon footprint.',
    },
    {
      image: 'bike.jpg',
      title: 'Group Bike Rides',
      description: 'Join or create group bike rides in your area for a fun and healthy way to explore.',
    },
  ];
}
