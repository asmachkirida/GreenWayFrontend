import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  userId = 14;  // Assume user ID is 14 for demonstration

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
    this.loadUserData();
  }

  loadUserData() {
    this.http.get<any>(`http://localhost:8080/admin/get-user/${this.userId}`).subscribe(data => {
      this.profileForm.patchValue({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate.split('T')[0],  // Format date as yyyy-mm-dd
        phoneNumber: data.phoneNumber,
        city: data.city,
        password: '',
        confirmPassword: '',
      });
    });
  }

  enableEditing() {
    this.isEditing = true;
    this.profileForm.enable();
  }

  saveChanges() {
    if (this.profileForm.valid && this.profileForm.get('password')?.value === this.profileForm.get('confirmPassword')?.value) {
      const updatedUserData = {
        ...this.profileForm.value,
        role: 'PASSENGER',  // Add the role field
        birthDate: new Date(this.profileForm.get('birthDate')?.value).toISOString()  // Convert birthDate to ISO string
      };

      this.http.put(`http://localhost:8080/admin/update/${this.userId}`, updatedUserData).subscribe(() => {
        alert('Profile updated successfully');
        this.isEditing = false;
        this.profileForm.disable();
      }, error => {
        alert('Failed to update profile: ' + error.message);
      });
    } else {
      alert('Please ensure all fields are correctly filled and passwords match.');
    }
  }
}
