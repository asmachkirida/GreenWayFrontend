import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  services = [
    {
      icon: 'fa-car',
      title: 'Ride Sharing',
      description: 'Share your ride with others and reduce travel costs.',
    },
    {
      icon: 'fa-bicycle',
      title: 'Group Bike Rides',
      description: 'Join or create group bike rides in your area.',
    },
  ];
}
