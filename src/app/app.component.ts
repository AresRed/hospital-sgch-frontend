import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./modules/auth/login/login.component";
import { AuthComponent } from "./modules/auth/auth/auth.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, AuthComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'hospital-sgch-frontend';
}
