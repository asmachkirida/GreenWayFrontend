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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDrivers();
  }

  loadDrivers() {
    // Encode search term to handle special characters and spaces properly
    const searchQuery = this.searchTerm.trim() ? `?searchTerm=${encodeURIComponent(this.searchTerm.trim())}` : '';
    this.http.get<any[]>(`http://localhost:8080/admin/drivers/search${searchQuery}`).subscribe(data => {
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

  editDriver(id: number) {
    // Implement edit logic
    console.log('Edit driver', id);
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
  

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
