import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Notification {
  id: number;
  message: string;
  icon: string;
  timestamp: Date;
  read: boolean;
  passengerId: number;  // Corrected to match the backend response
  passenger?: {         // Optional, since it will be populated later
    fullName: string;
    phoneNumber: string;
    gender: string;
    city: string;
  };
}


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.http.get<Notification[]>('http://localhost:8080/driver/notifications/driver/49').subscribe(notifications => {
      // Iterate over each notification
      notifications.forEach(notification => {
        if (notification.passengerId) {
          // Fetch passenger details using the passengerId
          this.http.get<any>(`http://localhost:8080/admin/get-user/48`).subscribe(response => {
            const passenger = response.ourUsers;
            notification.passenger = {
              fullName: `${passenger.firstName} ${passenger.lastName}`,
              phoneNumber: passenger.phoneNumber,
              gender: passenger.gender,
              city: passenger.city,
            };
          });
        } else {
          console.error('Passenger ID is missing for notification:', notification);
        }
      });
  
      // Assign the fetched notifications to the component's notifications array
      this.notifications = notifications;
    });
  }
  
  

  markAsRead(notification: Notification): void {
    notification.read = true;
    // Logic to mark as read in the backend
    this.http.put(`http://localhost:8080/driver/notifications/${notification.id}/read`, {}).subscribe();
  }
}
