import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements AfterViewInit {
  
  ngAfterViewInit() {
    document.querySelector('.plus-button')?.addEventListener('click', function() {
      const passengersInput = document.getElementById('passengers') as HTMLInputElement;
      passengersInput.value = (parseInt(passengersInput.value) + 1).toString();
    });
  }
}
