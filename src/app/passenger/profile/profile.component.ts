import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder) {
    // Initializing form with demo data
    this.profileForm = this.fb.group({
      email: [{ value: 'demo@example.com', disabled: true }],
      firstName: [{ value: 'John', disabled: true }],
      lastName: [{ value: 'Doe', disabled: true }],
      birthDate: [{ value: '1990-01-01', disabled: true }],
      phoneNumber: [{ value: '1234567890', disabled: true }],
      password: [{ value: 'password', disabled: true }],
      city: [{ value: 'New York', disabled: true }]
    });
  }

  ngOnInit(): void {}

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    Object.keys(this.profileForm.controls).forEach(control => {
      this.isEditMode ? this.profileForm.get(control)?.enable() : this.profileForm.get(control)?.disable();
    });
  }
}
