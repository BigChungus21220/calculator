import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<'light' | 'dark'>('dark');
  theme$ = this.themeSubject.asObservable();

  setTheme(mode: 'light' | 'dark') {
    const element : Element | null = document.querySelector('html');
    if (element) {
      if (mode == 'dark'){
        element.classList.add('app-dark');
      } else {
        element.classList.remove('app-dark');
      }
    }
    this.themeSubject.next(mode);
  }
}