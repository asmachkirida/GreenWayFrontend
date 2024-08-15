import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements AfterViewInit {

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.initAutocomplete();
    document.querySelector('.plus-button')?.addEventListener('click', function() {
      const passengersInput = document.getElementById('passengers') as HTMLInputElement;
      passengersInput.value = (parseInt(passengersInput.value) + 1).toString();
    });
  }

  initAutocomplete() {
    const departInput = document.getElementById('depart') as HTMLInputElement;
    const destinationInput = document.getElementById('destination') as HTMLInputElement;

    if (google && google.maps && google.maps.places) {
      const departAutocomplete = new google.maps.places.Autocomplete(departInput);
      const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);

      departAutocomplete.addListener('place_changed', () => {
        const place = departAutocomplete.getPlace();
        console.log('Depart place:', place);
      });

      destinationAutocomplete.addListener('place_changed', () => {
        const place = destinationAutocomplete.getPlace();
        console.log('Destination place:', place);
      });
    } else {
      console.error('Google Maps API is not loaded');
    }
  }

  onSearchSubmit() {
    const depart = (document.getElementById('depart') as HTMLInputElement).value;
    const destination = (document.getElementById('destination') as HTMLInputElement).value;
    const date = (document.getElementById('date') as HTMLInputElement).value;
    const passengers = (document.getElementById('passengers') as HTMLInputElement).value;

    const queryParams = {
      depart,
      destination,
      date,
      passengers,
    };
    console.log('Search submitted with:', { depart, destination, date, passengers });

    this.router.navigate(['/search-results'], { queryParams });
  }
}
