import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HelloComponent } from './hello/hello.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SigninComponent } from './pages/signin/signin.component';
import { PassengerComponent } from './passenger/passenger/passenger.component';
import { Page1Component } from './passenger/page1/page1.component';
import { Page2Component } from './passenger/page2/page2.component';
import { ProfileComponent } from './passenger/profile/profile.component';
import { RidesHistoryComponent } from './passenger/rides-history/rides-history.component';
import { BikeridesComponent } from './passenger/bikerides/bikerides.component';

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
  { path: 'hello', component: HelloComponent }, // This route does not include the common layout components
  { path: 'signup', component: SignupComponent }, // Signup route
  { path: 'signin', component: SigninComponent }, // Signin route
  { path: '**', redirectTo: '/hello' } // Redirect any unknown path to hello
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
