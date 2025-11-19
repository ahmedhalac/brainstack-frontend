import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, MatButtonModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  router = inject(Router);
  protected readonly title = signal('brainstack-frontend');

  // onLogin(): void {
  //   this.router.navigate(['/login']);
  // }

  // onRegister(): void {
  //   this.router.navigate(['/register']);
  // }
}
