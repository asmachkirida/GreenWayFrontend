import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  profileLink = '/passenger/profile';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'DRIVER') {
          this.profileLink = '/driver/profile';
        } else if (userRole === 'PASSENGER') {
          this.profileLink = '/passenger/profile';
        } else if (userRole === 'ADMIN') {
          this.profileLink = '/admin/statistics'; 
        }
      }
    });
  }
  

  logout(): void {
    this.authService.logout();
  }
}
