import { Component, OnInit, signal } from '@angular/core';
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
export class BlogComponent implements OnInit {
  blogs = signal<BlogModel[]>([]);
  
  constructor(private blogService: BlogService) {}
  
  ngOnInit() {
    this.blogs.set(this.blogService.getBlogs());
  }
}