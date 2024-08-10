import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';

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

  exportData() {
    // Implement export logic (e.g., export to CSV or Excel)
    console.log('Export data');
  }

  deleteDriver(id: number) {
    if (confirm('Are you sure you want to delete this driver?')) {
      this.http.delete(`http://localhost:8080/admin/delete/${id}`).subscribe(() => {
        this.loadDrivers(); // Refresh the list after deletion
      }, error => {
        console.error('Error deleting driver:', error);
      });
    }
  }
}
