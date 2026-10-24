import { Component, OnInit, signal } from '@angular/core';
import { COMMONMODULE } from '@angular/common';
import { Router } from '@angular/router';
import { DisciplerService } from '../services/discipler.service';
import { MessageService } from '../services/message.service';
import { Discipler, Message } from '../models';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [COMMONMODULE],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit {
  messages = signal<Message[]>([]);
  filteredMessages = signal<Message[]>([]);
  selectedDiscipler = signal<string | null>(null);
  selectedMessage = signal<Message | null>(null);
  
  constructor(
    private messageService: MessageService,
    private route: Router,
    private disciplerService: DisciplerService
  ) {}
  
  ngOnInit() {
    this.messages.set(this.messageService.getMessages());
    
    this.route.queryParams.subscribe(params => {
      if (params['discipler']) {
        this.selectedDiscipler.set(params['discipler']);
        this.filterMessages();
      } else {
        this.filteredMessages.set(this.messages());
      }
    });
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        const message = this.messages().find(m => m.id === +params['id']);
        if (message) {
          this.selectedMessage.set(message);
        }
      }
    });
  }
  
  filterMessages() {
    if (this.selectedDiscipler()) {
      this.filteredMessages.set(
        this.messages().filter(m => m.disciplerName === this.selectedDiscipler())
      );
    } else {
      this.filteredMessages.set(this.messages());
    }
  }
  
  getDisciplers(): string[] {
    return [...new Set(this.messages().map(m => m.disciplerName))];
  }
  
  selectDiscipler(name: string) {
    this.selectedDiscipler.set(name);
    this.filterMessages();
  }
  
  clearFilter() {
    this.selectedDiscipler.set(null);
    this.filteredMessages.set(this.messages());
  }
  
  selectMessage(message: Message) {
    this.selectedMessage.set(message);
  }
  
  closeMessageDetail() {
    this.selectedMessage.set(null);
  }
  
  getAvatarForDiscipler(name: string): string | undefined {
    return this.disciplerService.getDisciplerByName(name)?.avatar;
  }
  
  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}
