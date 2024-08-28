import { Component, OnInit } from '@angular/core';

interface Notification {
  message: string;
  icon: string;
  timestamp: Date;
  read: boolean;
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];

  constructor() { }

  ngOnInit(): void {
    // Load notifications (mock data for now)
    this.notifications = [
      {
        message: 'New ride booking from John Doe',
        icon: 'fa-user',
        timestamp: new Date(),
        read: false
      },
      {
        message: 'Ride cancelled by Jane Doe',
        icon: 'fa-times-circle',
        timestamp: new Date(),
        read: false
      }
    ];
  }

  markAsRead(notification: Notification): void {
    notification.read = true;
    // Additional logic to mark as read in the backend or remove from the list
  }
}
