import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DisciplerService } from '../services/discipler.service';
import { MessageService } from '../services/message.service';
import { Discipler, Message } from '../models';

@Component({
  selector: 'app-discplers',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './discplers.html',
  styleUrl: './discplers.css'
})
export class Discplers {
  disciplers = computed(() => this.disciplerService.getDisciplers());
  openDropdown = signal<number | null>(null);
  
  constructor(
    private disciplerService: DisciplerService,
    private messageService: MessageService
  ) {}
  
  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  
  toggleDropdown(disciplerId: number) {
    this.openDropdown.update(current => current === disciplerId ? null : disciplerId);
  }
  
  getMessagesForDiscipler(disciplerId: number): Message[] {
    return this.messageService.getMessagesByDisciplerId(disciplerId);
  }
}