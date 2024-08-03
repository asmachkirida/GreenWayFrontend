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
        MatMenuModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
