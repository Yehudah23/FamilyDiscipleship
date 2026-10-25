import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DisciplerService } from '../services/discipler.service';
import { MessageService } from '../services/message.service';
import { Message } from '../models';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit {
  messages = computed(() => this.messageService.getMessages());
  selectedDiscipler = signal<string | null>(null);
  selectedMessage = signal<Message | null>(null);
  private routeMessageId = signal<number | null>(null);
  filteredMessages = computed(() => {
    const discipler = this.selectedDiscipler();
    return discipler
      ? this.messages().filter(message => message.disciplerName === discipler)
      : this.messages();
  });
  
  constructor(
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private disciplerService: DisciplerService
  ) {
    effect(() => {
      const id = this.routeMessageId();
      const message = id ? this.messages().find(item => item.id === id) : undefined;
      if (message) this.selectedMessage.set(message);
    });
  }
  
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['discipler']) {
        this.selectedDiscipler.set(params['discipler']);
      } else {
        this.selectedDiscipler.set(null);
      }
    });
    
    this.activatedRoute.params.subscribe(params => {
      this.routeMessageId.set(params['id'] ? Number(params['id']) : null);
    });
  }
  
  getDisciplers(): string[] {
    return [...new Set(this.messages().map(m => m.disciplerName))];
  }
  
  selectDiscipler(name: string) {
    this.selectedDiscipler.set(name);
  }

  clearFilter() {
    this.selectedDiscipler.set(null);
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
