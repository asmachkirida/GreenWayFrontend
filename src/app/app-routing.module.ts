import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HelloComponent } from './hello/hello.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupdriverComponent } from './pages/signupdriver/signupdriver.component';
import { PassengerComponent } from './passenger/passenger/passenger.component';
import { ProfileComponent } from './passenger/profile/profile.component';
import { RidesHistoryComponent } from './passenger/rides-history/rides-history.component';
import { BikeridesComponent } from './passenger/bikerides/bikerides.component';
import { SearchResultsComponent } from './search-results/search-results.component';

// Admin components
import { StatisticsComponent } from './admin/statistics/statistics.component';
import { PassengersComponent } from './admin/passengers/passengers.component';
import { DriversComponent } from './admin/drivers/drivers.component';
import { CarRidesComponent } from './admin/car-rides/car-rides.component';
import { BikeRidesComponent } from './admin/bike-rides/bike-rides.component';
import { CarsComponent } from './admin/cars/cars.component';
import { AdminComponent } from './admin/admin/admin.component';
import { AuthGuard } from '../app/services/auth.guard'; // Adjust path as necessary


// Driver components
import { DriverComponent } from './driver/driver/driver.component';
import { DriverprofileComponent } from './driver/driverprofile/driverprofile.component';
import { RidesHistoryComponent as DriverRidesHistoryComponent } from './driver/rides-history/rides-history.component';
import { AddRideComponent } from './driver/add-ride/add-ride.component';
import { CarComponent } from './driver/car/car.component';
import { NotificationComponent } from './driver/notification/notification.component';
const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // Add routes for main layout components here if needed
    ]
  },
  {
    path: 'passenger',
    component: PassengerComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'rides-history', component: RidesHistoryComponent },
      { path: 'bikerides', component: BikeridesComponent },
    ]
  },
  {
    path: 'driver',
    component: DriverComponent,
    children: [
      { path: 'profile', component: DriverprofileComponent },
      { path: 'rides-history', component: DriverRidesHistoryComponent },
      { path: 'add-ride', component: AddRideComponent },
      { path: 'car', component: CarComponent },
      { path: 'notifications', component: NotificationComponent },

    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'statistics', component: StatisticsComponent },
      { path: 'passengers', component: PassengersComponent },
      { path: 'drivers', component: DriversComponent },
      { path: 'car-rides', component: CarRidesComponent },
      { path: 'bike-rides', component: BikeRidesComponent },
      { path: 'cars', component: CarsComponent },
    ]
  },
  { path: 'hello', component: HelloComponent }, // This route does not include the common layout components
  { path: 'signin', component: SigninComponent, canActivate: [AuthGuard] },
  { path: 'signupdriver', component: SignupdriverComponent,canActivate: [AuthGuard]  },
  { path: 'signup', component: SignupComponent, canActivate: [AuthGuard] },
  { path: 'search-results', component: SearchResultsComponent }, // Search results route
  { path: '**', redirectTo: '/hello' } // Redirect any unknown path to hello
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
