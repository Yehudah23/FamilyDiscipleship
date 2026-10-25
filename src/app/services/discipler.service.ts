import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Discipler } from '../models';
import { ADMIN_API_BASE_URL } from './admin-api.config';

@Injectable({
  providedIn: 'root'
})
export class DisciplerService {
  private disciplers = signal<Discipler[]>([
{ id: 1, name: 'Glory Adekunle Opekun', email: 'gloryadekunleopekun@gmail.com', phone: '07032893052', avatar: '/glory adekunle opekun/Glory Adekunle Opekun.jpeg' },
{ id: 2, name: 'Pastor Simon poopola', email: 'simon@example.com', phone: '07064591445', avatar: '/Popoola Simon.jpeg' },
{ id: 3, name: 'Pastor Kehinde Ogunwole', email: 'kehinde@example.com', phone: '08132764074', avatar: '/kehinde ogunwole.jpeg' },
{ id: 4, name: 'Pastor Adeshina peter Olayinka', email: 'shina@example.com', phone: '08108281827', avatar: '/Adeshina.jpeg' }
  ]);

  constructor(private http: HttpClient) {
    this.http.get<Discipler[]>(`${ADMIN_API_BASE_URL}/disciplers`).subscribe({
      next: disciplers => this.disciplers.set(disciplers),
      error: error => console.error('Failed to load disciplers from the API', error)
    });
  }

  getDisciplers() {
    return this.disciplers();
  }

  getDisciplerById(id: number) {
    return this.disciplers().find(d => d.id === id);
  }

  getDisciplerByName(name: string) {
    return this.disciplers().find(d => d.name === name);
  }

  addDiscipler(discipler: Omit<Discipler, 'id'>): Observable<Discipler> {
    return this.http.post<Discipler>(`${ADMIN_API_BASE_URL}/disciplers`, discipler, {
      withCredentials: true
    }).pipe(tap(created => this.disciplers.update(list => [...list, created])));
  }

  updateDiscipler(id: number, discipler: Partial<Discipler>): Observable<Discipler> {
    return this.http.put<Discipler>(`${ADMIN_API_BASE_URL}/disciplers/${id}`, discipler, {
      withCredentials: true
    }).pipe(tap(updated => this.disciplers.update(list =>
      list.map(current => current.id === id ? updated : current)
    )));
  }

  deleteDiscipler(id: number): Observable<void> {
    return this.http.delete<void>(`${ADMIN_API_BASE_URL}/disciplers/${id}`, {
      withCredentials: true
    }).pipe(tap(() => this.disciplers.update(list =>
      list.filter(discipler => discipler.id !== id)
    )));
  }
}