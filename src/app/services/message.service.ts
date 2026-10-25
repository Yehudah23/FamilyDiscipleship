import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Message } from '../models';
import { ADMIN_API_BASE_URL } from './admin-api.config';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages = signal<Message[]>([
    { 
      id: 1, 
      disciplerId: 1, 
      disciplerName: 'Glory Adekunle Opekun', 
      title: 'Welcome to Discipleship', 
      content: 'Welcome everyone to our discipleship program. This is our first message to get started on this journey together.', 
      date: new Date('2026-01-15') 
    },
    { 
      id: 2, 
      disciplerId: 1, 
      disciplerName: 'Glory Adekunle Opekun', 
      title: 'Weekly Devotional - Faith', 
      content: 'This week we focus on faith. Hebrews 11:1 tells us that faith is the substance of things hoped for, the evidence of things not seen.', 
      date: new Date('2026-01-22') 
    },
    { 
      id: 3, 
      disciplerId: 1, 
      disciplerName: 'Glory Adekunle Opekun', 
      title: 'Prayer Requests', 
      content: 'Please share your prayer requests for this week. We will pray together as a community.', 
      date: new Date('2026-01-29') 
    },
    { 
      id: 4, 
      disciplerId: 2, 
      disciplerName: 'Pastor Simon poopola', 
      title: 'Bible Study: The Book of James', 
      content: 'Starting next week, we will begin a study on the Book of James. Please read chapter 1 before our first session.', 
      date: new Date('2026-01-18') 
    },
    { 
      id: 5, 
      disciplerId: 3, 
      disciplerName: 'Pastor Kehinde Ogunwole', 
      title: 'Community Outreach', 
      content: 'We are planning a community outreach event next month. Volunteers needed!', 
      date: new Date('2026-02-01') 
    },
    {
      id: 6,
      disciplerId: 4,
      disciplerName: 'Pastor Adeshina peter Olayinka',
      title: 'Youth Night: Identity in Christ',
      content: 'Join us as we explore what the Bible says about our identity in Christ. Open to all teens and young adults.',
      date: new Date('2026-02-10')
    }
  ]);

  constructor(private http: HttpClient) {
    this.http.get<Message[]>(`${ADMIN_API_BASE_URL}/messages`).subscribe({
      next: messages => this.messages.set(messages.map(message => ({
        ...message,
        date: new Date(message.date)
      }))),
      error: error => console.error('Failed to load messages from the API', error)
    });
  }

  getMessages() {
    return this.messages();
  }

  getMessagesByDisciplerId(disciplerId: number) {
    return this.messages().filter(m => m.disciplerId === disciplerId);
  }

  getMessagesByDisciplerName(disciplerName: string) {
    return this.messages().filter(m => m.disciplerName === disciplerName);
  }

  addMessage(message: Omit<Message, 'id'>): Observable<Message> {
    return this.http.post<Message>(`${ADMIN_API_BASE_URL}/messages`, message, {
      withCredentials: true
    }).pipe(tap(created => this.messages.update(list => [
      ...list,
      { ...created, date: new Date(created.date) }
    ])));
  }

  updateMessage(id: number, message: Partial<Message>): Observable<Message> {
    return this.http.put<Message>(`${ADMIN_API_BASE_URL}/messages/${id}`, message, {
      withCredentials: true
    }).pipe(tap(updated => this.messages.update(list =>
      list.map(current => current.id === id
        ? { ...updated, date: new Date(updated.date) }
        : current)
    )));
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${ADMIN_API_BASE_URL}/messages/${id}`, {
      withCredentials: true
    }).pipe(tap(() => this.messages.update(list => list.filter(message => message.id !== id))));
  }
}