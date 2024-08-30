import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Notification {
  id: number;
  message: string;
  icon: string;
  timestamp: Date;
  read: boolean;
  passengerId?: number;  // Optional field
  passenger?: {          // Optional field for passenger details
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
  driverId: number | null = null;  // To store the driver ID from local storage

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Get driver ID from local storage
    this.driverId = Number(localStorage.getItem('userId')); // Adjust key as needed

    if (this.driverId) {
      this.loadNotifications();
    } else {
      console.error('Driver ID is not found in local storage.');
    }
  }

  loadNotifications(): void {
    if (this.driverId) {
      this.http.get<Notification[]>(`http://localhost:8080/driver/notifications/driver/${this.driverId}`).subscribe(notifications => {
        // Iterate over each notification
        notifications.forEach(notification => {
          if (notification.passengerId) {
            // Fetch passenger details using the passengerId
            this.http.get<any>(`http://localhost:8080/admin/get-user/${notification.passengerId}`).subscribe(response => {
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
  }

  markAsRead(notification: Notification): void {
    notification.read = true;
    // Logic to mark as read in the backend
    this.http.put(`http://localhost:8080/driver/notifications/${notification.id}/read`, {}).subscribe();
  }
}
