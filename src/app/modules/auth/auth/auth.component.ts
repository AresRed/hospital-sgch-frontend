import { Component, OnInit } from '@angular/core';
import { LoginComponent } from "../login/login.component";
import { RegisterComponent } from "../register/register.component";
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-auth',
  
  imports: [LoginComponent, RegisterComponent,CommonModule],
  standalone:true,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit{

  
  activeTab: 'login' | 'register' = 'login';

  constructor() { }

  ngOnInit(): void {
  }
}
