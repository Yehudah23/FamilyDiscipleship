import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { Blog as BlogModel } from '../models';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})
export class BlogComponent {
  blogs = computed(() => this.blogService.getBlogs());

  constructor(private blogService: BlogService) {}
}