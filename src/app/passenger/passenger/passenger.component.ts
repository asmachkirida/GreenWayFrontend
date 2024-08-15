import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BikeRideDialogComponent } from '../bike-ride-dialog/bike-ride-dialog.component';

@Component({
  selector: 'app-passenger',
  templateUrl: './passenger.component.html',
  styleUrls: ['./passenger.component.css']
})
export class PassengerComponent {

  constructor(private dialog: MatDialog) {}

  openBikeRideModal(): void {
    this.dialog.open(BikeRideDialogComponent, {
      width: '400px', // Adjust the width as needed
    });
  }
}
