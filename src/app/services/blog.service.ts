import { Injectable, signal } from '@angular/core';
import { Blog } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private blogs = signal<Blog[]>([
    { 
      id: 1, 
      title: 'The Power of Prayer in Daily Life', 
      content: 'Prayer is not just a ritual but a powerful connection with God. When we pray consistently, we align our hearts with His will and experience His peace that surpasses all understanding.', 
      author: 'Pastor John Smith', 
      date: new Date('2026-01-10') 
    },
    { 
      id: 2, 
      title: 'Walking in Faith Through Uncertainty', 
      content: 'Life often brings unexpected challenges. Walking in faith means trusting God even when we cannot see the path ahead. Abraham\'s journey teaches us that faith is obedience without full knowledge.', 
      author: 'Sarah Williams', 
      date: new Date('2026-01-20') 
    },
    { 
      id: 3, 
      title: 'Building Strong Family Foundations', 
      content: 'A strong family is built on love, respect, and shared values. Regular family devotions, open communication, and serving together create bonds that withstand life\'s storms.', 
      author: 'David Brown', 
      date: new Date('2026-02-01') 
    }
  ]);

  getBlogs() {
    return this.blogs();
  }

  addBlog(blog: Omit<Blog, 'id'>) {
    const newId = Math.max(...this.blogs().map(b => b.id), 0) + 1;
    this.blogs.update(list => [...list, { ...blog, id: newId }]);
  }

  updateBlog(id: number, blog: Partial<Blog>) {
    this.blogs.update(list => 
      list.map(b => b.id === id ? { ...b, ...blog } : b)
    );
  }

  deleteBlog(id: number) {
    this.blogs.update(list => list.filter(b => b.id !== id));
  }
}