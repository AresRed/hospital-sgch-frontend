import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() color: string = 'blue';

  getSizeClass(): string {
    switch (this.size) {
      case 'sm': return 'h-4 w-4';
      case 'md': return 'h-8 w-8';
      case 'lg': return 'h-12 w-12';
      default: return 'h-8 w-8';
    }
  }

  getColorClass(): string {
    switch (this.color) {
      case 'blue': return 'text-blue-600';
      case 'white': return 'text-white';
      case 'gray': return 'text-gray-600';
      default: return 'text-blue-600';
    }
  }
}
