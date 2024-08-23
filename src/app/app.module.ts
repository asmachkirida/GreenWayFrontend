import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { AnimatedCardComponent } from './components/animated-card/animated-card.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import { CommonModule } from '@angular/common';  // Import CommonModule

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HelloComponent } from './hello/hello.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupdriverComponent } from './components/signupdriver/signupdriver.component';


import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { PassengerNavbarComponent } from './passenger/passenger-navbar/passenger-navbar.component';
import { PassengerSidebarComponent } from './passenger/passenger-sidebar/passenger-sidebar.component';
import { Page1Component } from './passenger/page1/page1.component';
import { Page2Component } from './passenger/page2/page2.component';
import { PassengerComponent } from './passenger/passenger/passenger.component';

import { MatMenuModule } from '@angular/material/menu';
import { BikeridesComponent } from './passenger/bikerides/bikerides.component';
import { RidesHistoryComponent } from './passenger/rides-history/rides-history.component';
import { ProfileComponent } from './passenger/profile/profile.component';
import { SearchResultsComponent } from './search-results/search-results.component';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { StatisticsComponent } from './admin/statistics/statistics.component';
import { PassengersComponent } from './admin/passengers/passengers.component';
import { DriversComponent } from './admin/drivers/drivers.component';
import { CarRidesComponent } from './admin/car-rides/car-rides.component';
import { BikeRidesComponent } from './admin/bike-rides/bike-rides.component';
import { CarsComponent } from './admin/cars/cars.component';
import { AdminComponent } from './admin/admin/admin.component';
import { BikeRideDialogComponent } from './passenger/bike-ride-dialog/bike-ride-dialog.component';
import { FooterComponent } from './components/footer/footer.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { ServicesComponent } from './components/services/services.component';
import { BookRideModalComponent } from './book-ride-modal/book-ride-modal.component';
import { DriverComponent } from './driver/driver/driver.component';
import { AddRideComponent } from './driver/add-ride/add-ride.component';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HeroComponent,
    SearchFormComponent,
    AnimatedCardComponent,
    HelloComponent,
    MainLayoutComponent,
    SignupComponent,
    SigninComponent,
    SignupdriverComponent,
    PassengerNavbarComponent,
    PassengerSidebarComponent,
    Page1Component,
    Page2Component,
    PassengerComponent,
    BikeridesComponent,
    RidesHistoryComponent,
    ProfileComponent,
    SearchResultsComponent,
    StatisticsComponent,
    PassengersComponent,
    DriversComponent,
    CarRidesComponent,
    BikeRidesComponent,
    CarsComponent,
    AdminComponent,
    BikeRideDialogComponent,
    FooterComponent,
    ReviewsComponent,
    NewsletterComponent,
    ServicesComponent,
    BookRideModalComponent,
    DriverComponent,
    AddRideComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
        MatIconModule,
        BrowserModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatButtonToggleModule,
        MatSidenavModule,
        MatListModule,
        MatDialogModule,
        MatSidenavModule,
        MatMenuModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSliderModule,
        FormsModule,
        MatDialogModule,
        CommonModule  // Add CommonModule here

  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
