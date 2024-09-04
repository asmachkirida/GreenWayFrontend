import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-passengers',
  templateUrl: './passengers.component.html',
  styleUrls: ['./passengers.component.css']
})
export class PassengersComponent implements OnInit {
  passengers: any[] = [];
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;
  searchTerm = '';
  selectedPassenger: any = null;
  showEditPassengerModal = false;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPassengers();
  }

  loadPassengers() {
    const searchQuery = this.searchTerm.trim() ? `?searchTerm=${encodeURIComponent(this.searchTerm.trim())}` : '';
    this.http.get<any[]>(`http://localhost:8080/admin/passengers/search${searchQuery}`).subscribe(data => {
      this.totalPages = Math.ceil(data.length / this.pageSize);
      this.passengers = data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    });
  }

  searchPassengers() {
    this.currentPage = 1;
    this.loadPassengers();
  }



  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPassengers();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPassengers();
    }
  }



  deletePassenger(id: number) {
    if (confirm('Are you sure you want to delete this passenger?')) {
      this.http.delete(`http://localhost:8080/admin/delete/${id}`).subscribe(() => {
        this.loadPassengers(); 
      }, error => {
        console.error('Error deleting passenger:', error);
      });
    }
  }


  exportData() {
    this.http.get<any[]>(`http://localhost:8080/admin/passengers`).subscribe(data => {
      this.exportToCSV(data);
    }, error => {
      console.error('Error exporting data:', error);
    });
  }
  
  exportToCSV(data: any[]) {
    const csvData = this.convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passengers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  convertToCSV(data: any[]): string {
    const header = 'ID,Email,First Name,Last Name,Birth Date,Phone Number,Gender,City,Membership\n';
    const rows = data.map(passenger =>
      `${passenger.id},${passenger.email},${passenger.firstName},${passenger.lastName},${new Date(passenger.birthDate).toLocaleDateString()},${passenger.phoneNumber},${passenger.gender},${passenger.city},${passenger.membership || 'N/A'}`
    ).join('\n');
    return header + rows;
  }
  



  editPassenger(passenger: any) {
    this.selectedPassenger = { ...passenger }; 
    this.showEditPassengerModal = true;
  }

  closeEditPassengerModal() {
    this.showEditPassengerModal = false;
  }

  updatePassenger() {
    if (!this.selectedPassenger || !this.selectedPassenger.id) {
      console.error('Passenger ID is required for updating.');
      return;
    }

    const updatedPassenger = {
      email: this.selectedPassenger.email,
      firstName: this.selectedPassenger.firstName,
      lastName: this.selectedPassenger.lastName,
      birthDate: this.selectedPassenger.birthDate,
      phoneNumber: this.selectedPassenger.phoneNumber,
      gender: this.selectedPassenger.gender,
      city: this.selectedPassenger.city,
      membership: this.selectedPassenger.membership,
      role: 'PASSENGER' // Ensure the role is included
    };

    this.http.put(`http://localhost:8080/admin/update/${this.selectedPassenger.id}`, updatedPassenger)
      .subscribe({
        next: () => {
          this.loadPassengers(); 
          this.closeEditPassengerModal(); // Close the modal
        },
        error: (err) => {
          console.error('Error updating passenger', err);
        }
      });
  }
}
