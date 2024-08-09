import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDrivers();
  }

  loadDrivers() {
    this.http.get<any[]>(`http://localhost:8080/admin/drivers`).subscribe(data => {
      this.totalPages = Math.ceil(data.length / this.pageSize);
      this.drivers = data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    });
  }

  editDriver(id: number) {
    // Implement edit logic
    console.log('Edit driver', id);
  }

  deleteDriver(id: number) {
    // Implement delete logic
    console.log('Delete driver', id);
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
}
