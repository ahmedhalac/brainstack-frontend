import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.dashboardService.getUsers().subscribe(() => {
      console.log('get users work');
      console.log("hello world")
    });
  }
}
