import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HelloComponent } from './hello/hello.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SigninComponent } from './pages/signin/signin.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // Add other routes that should include the common layout components here
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
