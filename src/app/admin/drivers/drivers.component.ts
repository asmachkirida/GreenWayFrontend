import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent implements OnInit {
  drivers: any[] = [];
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;
  searchTerm = '';
  searchByFirstName = true;
  selectedDriver: any = null; // To hold the driver data for editing
  showEditDriverModal: boolean = false; // Modal visibility flag

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDrivers();
  }

  loadDrivers() {
    // Encode search term to handle special characters and spaces properly
    const searchQuery = this.searchTerm.trim() ? `?searchTerm=${encodeURIComponent(this.searchTerm.trim())}` : '';
    this.http.get<any[]>(`http://localhost:8080/admin/drivers/search${searchQuery}`).subscribe(data => {
      console.log(data);  // Log the response data
      this.selectedDriver = this.drivers[0];
console.log(this.drivers);
      this.totalPages = Math.ceil(data.length / this.pageSize);
      this.drivers = data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    });
  }









  buildSearchQuery(): string {
    if (this.searchTerm.trim()) {
      if (this.searchByFirstName) {
        return `?firstName=${this.searchTerm}&lastName=`;
      } else {
        return `?firstName=&lastName=${this.searchTerm}`;
      }
    }
    return '';
  }

  searchDrivers() {
    this.currentPage = 1;
    this.loadDrivers();
  }





  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadDrivers();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadDrivers();
    }
  }



  deleteDriver(id: number) {
    if (confirm('Are you sure you want to delete this driver?')) {
      this.http.delete(`http://localhost:8080/admin/delete/${id}`).subscribe(() => {
        console.log("done");

        this.loadDrivers(); // Refresh the list after deletion
        console.log("done");
      }, error => {
        console.error('Error deleting driver:', error);
      });
    }
  }

  exportData() {
    // Fetch all drivers, not just the paginated ones
    this.http.get<any[]>(`http://localhost:8080/admin/drivers`).subscribe(data => {
      const csvData = this.convertToCSV(data);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'drivers.csv');
    });
  }
  
  convertToCSV(drivers: any[]): string {
    const header = ['ID', 'Email', 'First Name', 'Last Name', 'Birth Date', 'Phone Number', 'Gender', 'City', 'License Number', 'Rating'];
    const rows = drivers.map(driver => [
      driver.id,
      driver.email,
      driver.firstName,
      driver.lastName,
      new Date(driver.birthDate).toLocaleDateString(), // Format the date as needed
      driver.phoneNumber,
      driver.gender,
      driver.city,
      driver.licenseNumber || 'N/A',
      driver.rating
    ]);
  
    const csvContent = [header, ...rows].map(e => e.join(',')).join('\n');
    return csvContent;
  }
  

  openEditDriverModal(driver: any): void {
    this.selectedDriver = { ...driver };
    this.showEditDriverModal = true;
  }

  closeEditDriverModal(): void {
    this.showEditDriverModal = false;
    this.selectedDriver = null; 
  }

  updateDriver(): void {
    if (!this.selectedDriver || !this.selectedDriver.id) {
      console.error('Driver ID is required for updating.');
      return;
    }
  
    const driverData = {
      email: this.selectedDriver.email,
      firstName: this.selectedDriver.firstName,
      lastName: this.selectedDriver.lastName,
      birthDate: this.selectedDriver.birthDate.split('T')[0], 
      phoneNumber: this.selectedDriver.phoneNumber,
      role: this.selectedDriver.role, 
      city: this.selectedDriver.city
    };
  
    console.log('Data being sent to update the driver:', driverData);
  
  
  
    // Make the PUT request with only the necessary data
    this.http.put(`http://localhost:8080/admin/update/${this.selectedDriver.id}`, driverData)
      .subscribe({
        next: () => {
          this.loadDrivers(); // Reload the driver list
          this.closeEditDriverModal(); // Close the modal
        },
        error: (err) => {
          console.error('Error updating driver', err);
        }
      });
  }
  







}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
