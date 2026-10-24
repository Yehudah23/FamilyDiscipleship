import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisciplerService } from '../services/discipler.service';
import { MessageService } from '../services/message.service';
import { BlogService } from '../services/blog.service';
import { Discipler, Message, Blog } from '../models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
  activeTab = signal<'messages' | 'blogs' | 'disciplers'>('messages');
  
  disciplers = computed(() => this.disciplerService.getDisciplers());
  messages = computed(() => this.messageService.getMessages());
  blogs = computed(() => this.blogService.getBlogs());
  
  // Form models for template binding (regular properties for ngModel)
  messageFormModel = {
    disciplerId: 0,
    title: '',
    content: '',
    date: new Date()
  };
  
  blogFormModel = {
    title: '',
    content: '',
    author: '',
    date: new Date(),
    imageUrl: ''
  };
  
  disciplerFormModel = {
    name: '',
    email: '',
    phone: ''
  };
  
  // Form states
  showMessageForm = signal(false);
  editingMessage = signal<Message | null>(null);
  
  showBlogForm = signal(false);
  editingBlog = signal<Blog | null>(null);
  
  showDisciplerForm = signal(false);
  editingDiscipler = signal<Discipler | null>(null);
  
  constructor(
    private disciplerService: DisciplerService,
    private messageService: MessageService,
    private blogService: BlogService
  ) {}
  
  // Message handlers
  onAddMessage() {
    const form = this.messageFormModel;
    const discipler = this.disciplers().find(d => d.id === form.disciplerId);
    if (!discipler) return;
    
    const messageData: Omit<Message, 'id'> = {
      disciplerId: form.disciplerId,
      disciplerName: discipler.name,
      title: form.title,
      content: form.content,
      date: form.date
    };
    
    if (this.editingMessage()) {
      this.messageService.updateMessage(this.editingMessage()!.id, messageData);
    } else {
      this.messageService.addMessage(messageData);
    }
    this.resetMessageForm();
  }
  
  editMessage(message: Message) {
    this.editingMessage.set(message);
    const discipler = this.disciplers().find(d => d.name === message.disciplerName);
    this.messageFormModel = {
      disciplerId: discipler?.id || 0,
      title: message.title,
      content: message.content,
      date: message.date
    };
    this.showMessageForm.set(true);
  }
  
  deleteMessage(id: number) {
    if (confirm('Are you sure you want to delete this message?')) {
      this.messageService.deleteMessage(id);
    }
  }
  
  cancelMessageEdit() {
    this.resetMessageForm();
  }
  
  private resetMessageForm() {
    this.showMessageForm.set(false);
    this.editingMessage.set(null);
    this.messageFormModel = {
      disciplerId: 0,
      title: '',
      content: '',
      date: new Date()
    };
  }
  
  // Blog handlers
  onAddBlog() {
    const form = this.blogFormModel;
    const blogData: Omit<Blog, 'id'> = {
      title: form.title,
      content: form.content,
      author: form.author,
      date: form.date,
      imageUrl: form.imageUrl
    };
    
    if (this.editingBlog()) {
      this.blogService.updateBlog(this.editingBlog()!.id, blogData);
    } else {
      this.blogService.addBlog(blogData);
    }
    this.resetBlogForm();
  }
  
  editBlog(blog: Blog) {
    this.editingBlog.set(blog);
    this.blogFormModel = {
      title: blog.title,
      content: blog.content,
      author: blog.author,
      date: blog.date,
      imageUrl: blog.imageUrl || ''
    };
    this.showBlogForm.set(true);
  }
  
  deleteBlog(id: number) {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogService.deleteBlog(id);
    }
  }
  
  cancelBlogEdit() {
    this.resetBlogForm();
  }
  
  private resetBlogForm() {
    this.showBlogForm.set(false);
    this.editingBlog.set(null);
    this.blogFormModel = {
      title: '',
      content: '',
      author: '',
      date: new Date(),
      imageUrl: ''
    };
  }
  
  // Discipler handlers
  onAddDiscipler() {
    const form = this.disciplerFormModel;
    const disciplerData: Omit<Discipler, 'id'> = {
      name: form.name,
      email: form.email,
      phone: form.phone
    };
    
    if (this.editingDiscipler()) {
      this.disciplerService.updateDiscipler(this.editingDiscipler()!.id, disciplerData);
    } else {
      this.disciplerService.addDiscipler(disciplerData);
    }
    this.resetDisciplerForm();
  }
  
  editDiscipler(discipler: Discipler) {
    this.editingDiscipler.set(discipler);
    this.disciplerFormModel = {
      name: discipler.name,
      email: discipler.email,
      phone: discipler.phone
    };
    this.showDisciplerForm.set(true);
  }
  
  deleteDiscipler(id: number) {
    if (confirm('Are you sure you want to delete this discipler?')) {
      this.disciplerService.deleteDiscipler(id);
    }
  }
  
  cancelDisciplerEdit() {
    this.resetDisciplerForm();
  }
  
  private resetDisciplerForm() {
    this.showDisciplerForm.set(false);
    this.editingDiscipler.set(null);
    this.disciplerFormModel = {
      name: '',
      email: '',
      phone: ''
    };
  }
}