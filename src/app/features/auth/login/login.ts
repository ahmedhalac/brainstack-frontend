import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-login',
  imports: [MatSlideToggleModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {}
