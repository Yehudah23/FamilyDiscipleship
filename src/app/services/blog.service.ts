import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Blog } from '../models';
import { ADMIN_API_BASE_URL } from './admin-api.config';

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

  constructor(private http: HttpClient) {
    this.http.get<Blog[]>(`${ADMIN_API_BASE_URL}/blogs`).subscribe({
      next: blogs => this.blogs.set(blogs.map(blog => ({
        ...blog,
        date: new Date(blog.date)
      }))),
      error: error => console.error('Failed to load blogs from the API', error)
    });
  }

  getBlogs() {
    return this.blogs();
  }

  addBlog(blog: Omit<Blog, 'id'>): Observable<Blog> {
    return this.http.post<Blog>(`${ADMIN_API_BASE_URL}/blogs`, blog, {
      withCredentials: true
    }).pipe(tap(created => this.blogs.update(list => [
      ...list,
      { ...created, date: new Date(created.date) }
    ])));
  }

  updateBlog(id: number, blog: Partial<Blog>): Observable<Blog> {
    return this.http.put<Blog>(`${ADMIN_API_BASE_URL}/blogs/${id}`, blog, {
      withCredentials: true
    }).pipe(tap(updated => this.blogs.update(list => list.map(current =>
      current.id === id
        ? { ...updated, date: new Date(updated.date) }
        : current
    ))));
  }

  deleteBlog(id: number): Observable<void> {
    return this.http.delete<void>(`${ADMIN_API_BASE_URL}/blogs/${id}`, {
      withCredentials: true
    }).pipe(tap(() => this.blogs.update(list => list.filter(blog => blog.id !== id))));
  }
}