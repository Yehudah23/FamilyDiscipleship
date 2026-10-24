import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DisciplerService } from '../services/discipler.service';
import { MessageService } from '../services/message.service';
import { BlogService } from '../services/blog.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {
  private disciplerService = inject(DisciplerService);
  private messageService = inject(MessageService);
  private blogService = inject(BlogService);

  disciplersCount = this.disciplerService.getDisciplers().length;
  messageCount = this.messageService.getMessages().length;
  blogCount = this.blogService.getBlogs().length;
}
