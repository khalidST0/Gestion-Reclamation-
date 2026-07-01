import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Added for Live Backend Operations
import { SearchService } from '../../search.service';
import { Subscription } from 'rxjs';

interface MetricCard {
  title: string;
  value: number;
  change: string;
  isPositive: boolean;
  color: string;
}

interface Reclamation {
  id: string; // Maps to your database primary key
  client: string;
  type: string;
  date: string;
  createdAt?: string;
  status: string;
  statusClass: string;
  description?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Stats summary headers
  metrics: MetricCard[] = [
    { title: 'Total Réclamations', value: 0, change: 'En temps réel', isPositive: true, color: '#8b5cf6' },
    { title: 'En Attente', value: 0, change: 'Requiert action', isPositive: false, color: '#f59e0b' },
    { title: 'En Cours de Traitement', value: 0, change: 'En progression', isPositive: true, color: '#2563eb' },
    { title: 'Résolues', value: 0, change: 'Clôturées', isPositive: true, color: '#10b981' }
  ];

  // Dynamic lists fed from PostgreSQL database
  recentReclamations: Reclamation[] = [];
  filteredReclamations: Reclamation[] = [];

  private searchSubscription!: Subscription;
  private backendUrl = 'http://localhost:3000/api/reclamations'; // Your Express server port

  // UI Panel state control trackers
  selectedReclamation: Reclamation | null = null;
  activeFormMode: 'add' | 'modify' | null = null;
  currentFormReclamation: Reclamation = this.getEmptyReclamation();

  // Inject HttpClient alongside your SearchService
  constructor(private searchService: SearchService, private http: HttpClient) {}

  ngOnInit(): void {
    // 1. Load local reclamation state first so metrics stay in sync with the page
    this.loadLocalReclamations();

    // 2. Fetch remote records from the backend when available
    this.loadReclamationsFromBackend();

    // 3. Keep your global search functionality working seamlessly
    this.searchSubscription = this.searchService.searchQuery$.subscribe(query => {
      const recentItems = this.getRecentReclamations(this.recentReclamations);
      if (!query.trim()) {
        this.filteredReclamations = recentItems;
      } else {
        const lowerQuery = query.toLowerCase();
        this.filteredReclamations = recentItems.filter(rec =>
          rec.client.toLowerCase().includes(lowerQuery) ||
          rec.id.toString().toLowerCase().includes(lowerQuery) ||
          rec.type.toLowerCase().includes(lowerQuery) ||
          rec.status.toLowerCase().includes(lowerQuery)
        );
      }
    });
  }

  private loadLocalReclamations(): void {
    const saved = localStorage.getItem('reclamations');
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as Reclamation[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        this.recentReclamations = parsed.map(item => ({
          ...item,
          date: item.date,
          createdAt: item.createdAt || this.getCreatedAt(item).toISOString(),
          status: this.translateStatus(item.status),
          statusClass: this.getStatusCSSClass(this.translateStatus(item.status))
        }));
        this.filteredReclamations = this.getRecentReclamations(this.recentReclamations);
        this.calculateMetrics();
      }
    } catch {
      // ignore invalid data
    }
  }

  // Helper to build headers with your JWT token for authentication middleware
  private getAuthHeaders() {
    const token = localStorage.getItem('token'); // Retrieve stored authentication token
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // Core Action: READ (Fetch items & update metric calculations dynamically)
  loadReclamationsFromBackend(): void {
    this.http.get<any[]>(this.backendUrl, this.getAuthHeaders()).subscribe({
      next: (data) => {
        // Map database naming schema to your local object fields structure
        this.recentReclamations = data.map(dbItem => {
          const rawStatus = dbItem.status || '';
          const normalizedStatus = this.translateStatus(rawStatus);
          const rawDate = dbItem.created_at || dbItem.date;
          const formattedDate = new Date(rawDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
          return {
            id: dbItem.id,
            client: dbItem.client_name || dbItem.client,
            type: dbItem.type,
            date: formattedDate,
            createdAt: new Date(rawDate).toISOString(),
            status: normalizedStatus,
            statusClass: this.getStatusCSSClass(normalizedStatus)
          };
        });

        this.filteredReclamations = this.getRecentReclamations(this.recentReclamations);
        this.calculateMetrics();
      },
      error: (err) => console.error('Erreur de chargement backend:', err)
    });
  }

  // Core Action: SELECT (View data)
  onSelectReclamation(rec: Reclamation): void {
    this.selectedReclamation = rec;
    this.activeFormMode = null;
  }

  // Form Setup: Open Clean Add Form
  openAddForm(): void {
    this.activeFormMode = 'add';
    this.selectedReclamation = null;
    this.currentFormReclamation = this.getEmptyReclamation();
  }

  // Form Setup: Open populated Edit Form
  openModifyForm(rec: Reclamation): void {
    this.activeFormMode = 'modify';
    this.selectedReclamation = null;
    this.currentFormReclamation = { ...rec };
  }

  // Core Actions: CREATE & UPDATE (Save changes to PostgreSQL database via Express API)
  onSave(): void {
    const payload: any = {
      client_name: this.currentFormReclamation.client,
      type: this.currentFormReclamation.type,
      status: this.currentFormReclamation.status
    };

    if (this.currentFormReclamation.description !== undefined) {
      payload.description = this.currentFormReclamation.description;
    }

    if (this.activeFormMode === 'add') {
      // POST call to your create endpoint
      this.http.post(this.backendUrl, payload, this.getAuthHeaders()).subscribe({
        next: () => {
          this.loadReclamationsFromBackend(); // Reload table directly from the database source
          this.closePanels();
        },
        error: (err) => console.error("Erreur lors de la création:", err)
      });
    } else if (this.activeFormMode === 'modify') {
      // PUT call to your update endpoint using the specific item ID URL parameter
      this.http.put(`${this.backendUrl}/${this.currentFormReclamation.id}`, payload, this.getAuthHeaders()).subscribe({
        next: () => {
          this.loadReclamationsFromBackend(); // Refresh metrics and data arrays automatically
          this.closePanels();
        },
        error: (err) => console.error("Erreur lors de la modification:", err)
      });
    }
  }

  closePanels(): void {
    this.selectedReclamation = null;
    this.activeFormMode = null;
  }

  private getStatusCSSClass(status: string): string {
    if (status === 'En Attente') return 'status-pending';
    if (status === 'En Cours de Traitement') return 'status-progress';
    if (status === 'Résolue') return 'status-resolved';
    return 'status-pending';
  }

  private translateStatus(status: string): string {
    const normalized = (status || '').toString().trim().toLowerCase();
    if (normalized.includes('attente') || normalized.includes('pending')) {
      return 'En Attente';
    }
    if (normalized.includes('cours') || normalized.includes('progress')) {
      return 'En Cours de Traitement';
    }
    if (normalized.includes('résolu') || normalized.includes('resolv')) {
      return 'Résolue';
    }
    return status || 'En Attente';
  }

  private calculateMetrics(): void {
    const total = this.recentReclamations.length;
    const pending = this.recentReclamations.filter(r => r.status === 'En Attente').length;
    const progress = this.recentReclamations.filter(r => r.status === 'En Cours de Traitement').length;
    const resolved = this.recentReclamations.filter(r => r.status === 'Résolue').length;

    this.metrics[0].value = total;
    this.metrics[1].value = pending;
    this.metrics[2].value = progress;
    this.metrics[3].value = resolved;
  }

  private getRecentReclamations(recs: Reclamation[]): Reclamation[] {
    const now = new Date();
    return recs.filter(rec => {
      const createdAt = this.getCreatedAt(rec);
      if (Number.isNaN(createdAt.getTime())) {
        return false;
      }
      const deltaDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return deltaDays <= 3;
    });
  }

  private getCreatedAt(rec: Reclamation): Date {
    if (rec.createdAt) {
      const date = new Date(rec.createdAt);
      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }

    const parsed = Date.parse(rec.date);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed);
    }

    const months: Record<string, string> = {
      janvier: '01', février: '02', mars: '03', avril: '04', mai: '05', juin: '06', juillet: '07', août: '08', septembre: '09', octobre: '10', novembre: '11', décembre: '12'
    };
    const parts = rec.date.toLowerCase().replace(/,/g, '').split(' ');
    if (parts.length >= 3) {
      const day = parts[0].padStart(2, '0');
      const month = months[parts[1]];
      const year = parts[2];
      if (month) {
        const formatted = `${year}-${month}-${day}`;
        const fallbackDate = new Date(formatted);
        if (!Number.isNaN(fallbackDate.getTime())) {
          return fallbackDate;
        }
      }
    }

    return new Date('1970-01-01T00:00:00Z');
  }

  private getEmptyReclamation(): Reclamation {
    return { id: '', client: '', type: 'Technique', date: '', status: 'En Attente', statusClass: 'status-pending', description: '' };
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
