import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SearchService } from '../../search.service';

interface Reclamation {
  id: number;
  title: string;
  type: string;
  description: string;
  status: string;
  date: string;
}

@Component({
  selector: 'app-reclamation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reclamation.html',
  styleUrl: './reclamation.css'
})
export class ReclamationView implements OnInit, OnDestroy {
  private storageKey = 'reclamations';

  reclamations: Reclamation[] = [
    { id: 1, title: 'Server connection timeout error', type: 'Technical', description: 'The server repeatedly times out when trying to connect.', status: 'En Attente', date: '2026-06-16' },
    { id: 2, title: 'Duplicate charge on invoice #402', type: 'Financial', description: 'Customer was billed twice for the same invoice.', status: 'Résolue', date: '2026-06-14' },
    { id: 3, title: 'Requesting access permissions extension', type: 'Access Management', description: 'User requires elevated access rights for project files.', status: 'En Cours', date: '2026-06-15' }
  ];

  filteredReclamations: Reclamation[] = [];
  currentQuery: string = '';
  private searchSubscription?: Subscription;

  selectedReclamation: Reclamation | null = null;
  isEditModalOpen: boolean = false;
  editTitle: string = '';
  editType: string = '';
  editDescription: string = '';

  isAddModalOpen: boolean = false;
  newTitle: string = '';
  newType: string = '';
  newDescription: string = '';
  nextId: number = 4;

  reclamationTypes: string[] = [
    'Technical',
    'Financial',
    'Access Management',
    'Billing',
    'Service',
    'Delivery',
    'Support',
    'Security',
    'Compliance',
    'Other'
  ];

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.loadStoredReclamations();
    this.filteredReclamations = [...this.reclamations];

    this.searchSubscription = this.searchService.searchQuery$.subscribe(query => {
      this.currentQuery = query.trim();
      this.filterReclamations(this.currentQuery);
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  openModifyModal(reclamation: Reclamation): void {
    this.selectedReclamation = reclamation;
    this.editTitle = reclamation.title;
    this.editType = reclamation.type || this.reclamationTypes[0];
    this.editDescription = reclamation.description;
    this.isEditModalOpen = true;
  }

  saveModify(): void {
    if (this.selectedReclamation) {
      this.selectedReclamation.title = this.editTitle;
      this.selectedReclamation.type = this.editType;
      this.selectedReclamation.description = this.editDescription;
      this.closeModal();
      alert('Réclamation updated successfully!');
    }
  }

  closeModal(): void {
    this.isEditModalOpen = false;
    this.selectedReclamation = null;
  }

  removeReclamation(id: number): void {
    if (confirm('Are you sure you want to remove this reclamation?')) {
      this.reclamations = this.reclamations.filter(r => r.id !== id);
      this.saveReclamations();
      this.filterReclamations(this.currentQuery);
      alert('Réclamation removed successfully!');
    }
  }

  openAddModal(): void {
    this.isAddModalOpen = true;
    this.newTitle = '';
    this.newType = this.reclamationTypes[0];
    this.newDescription = '';
  }

  saveNewReclamation(): void {
    if (this.newTitle.trim() && this.newType.trim() && this.newDescription.trim()) {
      const today = new Date().toISOString().split('T')[0];
      const newReclamation: Reclamation = {
        id: this.nextId++,
        title: this.newTitle,
        type: this.newType,
        description: this.newDescription,
        status: 'En Attente',
        date: today
      };
      this.reclamations.push(newReclamation);
      this.saveReclamations();
      this.filterReclamations(this.currentQuery);
      this.closeAddModal();
      alert('Réclamation created successfully!');
    } else {
      alert('Please fill in all fields!');
    }
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
    this.newTitle = '';
    this.newType = '';
    this.newDescription = '';
  }

  private loadStoredReclamations(): void {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Reclamation[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.reclamations = parsed;
          this.nextId = Math.max(...parsed.map(r => r.id), 0) + 1;
          return;
        }
      } catch {
        // ignore invalid storage data and fall back to defaults
      }
    }

    this.saveReclamations();
  }

  private saveReclamations(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.reclamations));
  }

  private filterReclamations(query: string): void {
    if (!query) {
      this.filteredReclamations = [...this.reclamations];
      return;
    }

    const normalizedQuery = query.toLowerCase();
    const numericQuery = query.replace(/[^0-9]/g, '');

    const exactMatches = this.reclamations.filter(item => {
      const exactTitle = item.title.toLowerCase() === normalizedQuery;
      const exactId = numericQuery && item.id.toString() === numericQuery;
      return exactTitle || exactId;
    });

    if (exactMatches.length > 0) {
      this.filteredReclamations = exactMatches;
      return;
    }

    this.filteredReclamations = this.reclamations.filter(item => {
      const idMatch = numericQuery ? item.id.toString().includes(numericQuery) : false;
      const titleMatch = item.title.toLowerCase().includes(normalizedQuery);
      return idMatch || titleMatch;
    });
  }

  getStatusClass(status: string): string {
    const normalized = status.toLowerCase();
    if (normalized.includes('attente')) return 'pending';
    if (normalized.includes('résolue')) return 'resolved';
    if (normalized.includes('cours')) return 'in-progress';
    return normalized.replace(/\s+/g, '-');
  }
}
