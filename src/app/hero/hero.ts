import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DisciplerService } from '../services/discipler.service';
import { MessageService } from '../services/message.service';
import { BlogService } from '../services/blog.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {
  private disciplerService = inject(DisciplerService);
  private messageService = inject(MessageService);
  private blogService = inject(BlogService);

  disciplersCount = this.disciplerService.getDisciplers().length;
  familiesServed = '50+';
  yearlyPrograms = '12+';
  faithCentered = '100%';
  messageCount = this.messageService.getMessages().length;
  blogCount = this.blogService.getBlogs().length;
}
