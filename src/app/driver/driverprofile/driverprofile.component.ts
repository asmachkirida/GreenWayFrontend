import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-driverprofile',
  templateUrl: './driverprofile.component.html',
  styleUrls: ['./driverprofile.component.css']
})
export class DriverprofileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  userEmail: string | null = null;  // Store email instead of user ID
  userId: number | null = null;  // Store user ID
  profileImage: string = '';  // Default profile image
  totalRides: number = 0;
  recentActivity: any[] = [];
  rating: number | null = null;
  mostRecentActivityDate: string | null = null;
  recentActivityDescription: string = ''; // For description

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      firstName: [{ value: '', disabled: true }, Validators.required],
      lastName: [{ value: '', disabled: true }, Validators.required],
      birthDate: [{ value: '', disabled: true }, Validators.required],
      phoneNumber: [{ value: '', disabled: true }, Validators.required],
      city: [{ value: '', disabled: true }, Validators.required],
      password: [{ value: '', disabled: true }, Validators.required],
      confirmPassword: [{ value: '', disabled: true }, Validators.required],
    });
  }

  ngOnInit(): void {
    console.log("ngOnInit called");
    this.extractUserEmailFromToken();
    this.extractUserIdFromLocalStorage();
    if (this.userEmail && this.userId !== null) {
      this.loadUserData();
      this.loadTotalRides();
      this.loadRecentActivity();
      this.fetchRecentActivity(); // Add this line to fetch recent activity
    } else {
      console.warn('No user email or ID found. User may not be logged in.');
    }
  }

  extractUserEmailFromToken() {
    const token = localStorage.getItem('authToken');
    console.log('Token:', token);
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);
        this.userEmail = decodedToken.sub;  // Extract email from token payload
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.warn('No token found in localStorage.');
    }
  }

  extractUserIdFromLocalStorage() {
    const userId = localStorage.getItem('userId');
    console.log('User ID:', userId);
    this.userId = userId ? parseInt(userId, 10) : null;
  }

  loadUserData() {
    if (this.userEmail) {
      console.log("Loading user data for email:", this.userEmail);
      this.http.get<any>(`http://localhost:8080/admin/get-user-by-email?email=${encodeURIComponent(this.userEmail)}`).subscribe(data => {
        console.log('User Data:', data);

        // Extract user ID from the response
        this.userId = data.ourUsers.id;
        const gender = data.ourUsers.gender;  // Assuming gender is part of the response

        // Set the profile image based on gender
        this.profileImage = gender === 'Female' ? 'gal0.png' : 'pro.png';

        // Set the rating
        this.rating = data.ourUsers.rating;

        // Patch the form with user data
        this.profileForm.patchValue({
          email: data.ourUsers.email,
          firstName: data.ourUsers.firstName,
          lastName: data.ourUsers.lastName,
          birthDate: data.ourUsers.birthDate.split('T')[0],  // Format date as yyyy-mm-dd
          phoneNumber: data.ourUsers.phoneNumber,
          city: data.ourUsers.city,
          password: '',
          confirmPassword: '',
        });

        // Confirm the form values after patching
        console.log('Profile Form Values:', this.profileForm.value);
      }, error => {
        console.error('Error fetching user data:', error);
        alert('Failed to load user data.');
      });
    }
  }

  loadTotalRides() {
    if (this.userId !== null) {
      this.http.get<any[]>(`http://localhost:8080/rides/driver/${this.userId}`).subscribe(rides => {
        this.totalRides = rides.length;
        console.log('Total Rides:', this.totalRides);
      }, error => {
        console.error('Error fetching rides:', error);
        alert('Failed to load total rides.');
      });
    }
  }

// driverprofile.component.ts

loadRecentActivity(): void {
  if (this.userId !== null) {
    this.http.get<any[]>(`http://localhost:8080/rides/driver/${this.userId}`).subscribe(rides => {
      // Assuming the API response contains rides with a date field
      this.recentActivity = rides
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10); // Get the most recent 10 rides, adjust as needed

      console.log('Recent Activity:', this.recentActivity);
    }, error => {
      console.error('Error fetching recent activity:', error);
      alert('Failed to load recent activity.');
    });
  }
}



  enableEditing() {
    this.isEditing = true;
    this.profileForm.enable();
    console.log('Editing enabled');
  }

  saveChanges() {
    if (this.userId && this.profileForm.valid && this.profileForm.get('password')?.value === this.profileForm.get('confirmPassword')?.value) {
      const updatedUserData = {
        ...this.profileForm.value,
        role: 'DRIVER',
        birthDate: new Date(this.profileForm.get('birthDate')?.value).toISOString()
      };

      console.log('Updated User Data:', updatedUserData);

      this.http.put(`http://localhost:8080/admin/update/${this.userId}`, updatedUserData).subscribe(() => {
        this.isEditing = false;
        this.profileForm.disable();
      }, error => {
        console.error('Error updating profile:', error);
      });
    } else {
      alert('Please ensure all fields are correctly filled and passwords match.');
    }
  }


  
fetchRecentActivity() {
  if (this.userId) {
    this.http.get<any[]>(`http://localhost:8080/rides/driver/${this.userId}`).subscribe(data => {
      const mostRecent = this.findMostRecentDate(data);
      this.mostRecentActivityDate = mostRecent.dateString; // Formatted date string
      this.recentActivityDescription = mostRecent.description; // Activity description
    }, error => {
      console.error('Error fetching recent activity:', error);
    });
  }
}

findMostRecentDate(data: any[]): { dateString: string, description: string } {
  if (data.length === 0) {
    return { dateString: '', description: 'No recent activity found.' };
  }

  let mostRecentDate = new Date(0);
  let recentDescription = '';

  data.forEach(ride => {
    const rideDate = new Date(ride.date);
    if (rideDate > mostRecentDate) {
      mostRecentDate = rideDate;
      recentDescription = `Added a ride from ${ride.startLocation} to ${ride.endLocation}.`; // Customize as needed
    }
  });

  return {
    dateString: mostRecentDate.toISOString().split('T')[0], // Format date as yyyy-mm-dd
    description: recentDescription
  };
}

}
