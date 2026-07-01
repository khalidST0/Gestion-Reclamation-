import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchSubject = new BehaviorSubject<string>('');
  // Components will subscribe to this stream
  searchQuery$ = this.searchSubject.asObservable();

  setQuery(query: string) {
    this.searchSubject.next(query);
  }
}
