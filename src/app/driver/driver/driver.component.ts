import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Adjust the path if necessary
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css'] // Changed from styleUrl to styleUrls
})
export class DriverComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/signin']); // Adjust the path to your sign-in route
  }
}
