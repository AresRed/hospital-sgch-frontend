import { Injectable } from '@angular/core';
import { MessageService as PrimeNgMessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private primeNgMessageService: PrimeNgMessageService) { }

  showSuccess(summary: string, detail: string): void {
    this.primeNgMessageService.add({ severity: 'success', summary: summary, detail: detail });
  }

  showInfo(summary: string, detail: string): void {
    this.primeNgMessageService.add({ severity: 'info', summary: summary, detail: detail });
  }

  showWarn(summary: string, detail: string): void {
    this.primeNgMessageService.add({ severity: 'warn', summary: summary, detail: detail });
  }

  showError(summary: string, detail: string): void {
    this.primeNgMessageService.add({ severity: 'error', summary: summary, detail: detail });
  }

  clear(): void {
    this.primeNgMessageService.clear();
  }
}
