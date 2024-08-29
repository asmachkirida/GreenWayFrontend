import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BikeRideDialogComponent } from '../bike-ride-dialog/bike-ride-dialog.component';
import { AuthService } from '../../services/auth.service'; // Adjust the path if necessary
import { Router } from '@angular/router';

@Component({
  selector: 'app-passenger',
  templateUrl: './passenger.component.html',
  styleUrls: ['./passenger.component.css']
})
export class PassengerComponent {

  constructor(private dialog: MatDialog, private authService: AuthService, private router: Router) {}

  openBikeRideModal(): void {
    this.dialog.open(BikeRideDialogComponent, {
      width: '400px', // Adjust the width as needed
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/signin']); // Adjust the path to your sign-in route
  }
}
