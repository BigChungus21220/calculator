import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ThemeService } from '../ThemeService';

@Component({
  selector: 'c-theme-toggle',
  imports: [
    ToggleSwitchModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './themeToggle.component.html',
  styleUrl: './themeToggle.component.scss'
})
export class ThemeToggleComponent {
  is_dark_mode : boolean = true;

  constructor(private themeService: ThemeService) {}

  setTheme() {
    this.themeService.setTheme(this.is_dark_mode ? 'light' : 'dark');
    this.is_dark_mode = !this.is_dark_mode;
  }
}