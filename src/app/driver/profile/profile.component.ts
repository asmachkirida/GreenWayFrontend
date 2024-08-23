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
    this.extractUserEmailFromToken();
    if (this.userEmail) {
      this.loadDriverData();
    } else {
      console.warn('No user email found. User may not be logged in.');
    }
  }

  extractUserEmailFromToken() {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.userEmail = decodedToken.sub;  // Extract email from token payload
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.warn('No token found in localStorage.');
    }
  }

  loadDriverData() {
    if (this.userEmail) {
      this.http.get<any>(`http://localhost:8080/admin/get-user-by-email?email=${encodeURIComponent(this.userEmail)}`).subscribe(data => {
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

      }, error => {
        console.error('Error fetching driver data:', error);
        alert('Failed to load driver data.');
      });
    }
  }

  enableEditing() {
    this.isEditing = true;
    this.profileForm.enable();
  }

  saveChanges() {
    if (this.userId && this.profileForm.valid && this.profileForm.get('password')?.value === this.profileForm.get('confirmPassword')?.value) {
      const updatedUserData = {
        ...this.profileForm.value,
        role: 'DRIVER',
        birthDate: new Date(this.profileForm.get('birthDate')?.value).toISOString()
      };

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
}
