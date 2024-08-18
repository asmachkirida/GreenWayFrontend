import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  userEmail: string | null = null;  // Store email instead of user ID
  userId: number | null = null;  // Store user ID

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
    if (this.userEmail) {
      this.loadUserData();
    } else {
      console.warn('No user email found. User may not be logged in.');
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

  loadUserData() {
    if (this.userEmail) {
      console.log("Loading user data for email:", this.userEmail);
      this.http.get<any>(`http://localhost:8080/admin/get-user-by-email?email=${encodeURIComponent(this.userEmail)}`).subscribe(data => {
        console.log('User Data:', data);

        // Extract user ID from the response
        this.userId = data.ourUsers.id;

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

  enableEditing() {
    this.isEditing = true;
    this.profileForm.enable();
    console.log('Editing enabled');
  }

  saveChanges() {
    if (this.userId && this.profileForm.valid && this.profileForm.get('password')?.value === this.profileForm.get('confirmPassword')?.value) {
      const updatedUserData = {
        ...this.profileForm.value,
        role: 'PASSENGER',
        birthDate: new Date(this.profileForm.get('birthDate')?.value).toISOString()
      };

      console.log('Updated User Data:', updatedUserData);

      this.http.put(`http://localhost:8080/admin/update/${this.userId}`, updatedUserData).subscribe(() => {
        alert('Profile updated successfully');
        this.isEditing = false;
        this.profileForm.disable();
      }, error => {
        alert('Failed to update profile: ' + error.message);
        console.error('Error updating profile:', error);
      });
    } else {
      alert('Please ensure all fields are correctly filled and passwords match.');
    }
  }
}
