import { Injectable, signal } from '@angular/core';
import { Discipler } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DisciplerService {
  private disciplers = signal<Discipler[]>([
    { id: 1, name: 'Glory Adekunle Opekun', email: 'glory@example.com', phone: '+234-801-234-5678', avatar: '/glory adekunle opekun/Glory Adekunle Opekun.jpeg' },
    { id: 2, name: 'Pastor Simon poopola', email: 'simon@example.com', phone: '+234-802-345-6789', avatar: '/Popoola Simon.jpeg' },
    { id: 3, name: 'Pastor Kehinde Ogunwole', email: 'kehinde@example.com', phone: '+234-803-456-7890', avatar: '/kehinde ogunwole.jpeg' },
    { id: 4, name: 'Pastor Shina', email: 'shina@example.com', phone: '+234-804-567-8901', avatar: '/Adeshina.jpeg' }
  ]);

  getDisciplers() {
    return this.disciplers();
  }

  getDisciplerById(id: number) {
    return this.disciplers().find(d => d.id === id);
  }

  getDisciplerByName(name: string) {
    return this.disciplers().find(d => d.name === name);
  }

  addDiscipler(discipler: Omit<Discipler, 'id'>) {
    const newId = Math.max(...this.disciplers().map(d => d.id)) + 1;
    this.disciplers.update(list => [...list, { ...discipler, id: newId }]);
  }

  updateDiscipler(id: number, discipler: Partial<Discipler>) {
    this.disciplers.update(list => 
      list.map(d => d.id === id ? { ...d, ...discipler } : d)
    );
  }

  deleteDiscipler(id: number) {
    this.disciplers.update(list => list.filter(d => d.id !== id));
  }
}