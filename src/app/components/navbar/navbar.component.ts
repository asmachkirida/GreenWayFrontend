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
        this.profileLink = userRole === 'DRIVER' ? '/driver/profile' : '/passenger/profile';
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
