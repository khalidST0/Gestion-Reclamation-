import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { SearchService } from '../../search.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayoutComponent {
  searchQuery: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private searchService: SearchService
  ) {}

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSearchChange(query: string): void {
    this.searchService.setQuery(query);
  }
}
