import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisciplerService } from '../services/discipler.service';
import { MessageService } from '../services/message.service';
import { BlogService } from '../services/blog.service';
import { AdminAuthService } from '../services/admin-auth.service';
import { CloudinaryService } from '../services/cloudinary.service';
import { Discipler, Message, Blog } from '../models';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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
    date: new Date(),
    imageUrl: '',
    audioUrl: ''
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
    phone: '',
    avatar: ''
  };

  uploadingImage = signal(false);
  uploadMessage = signal('');
  logoutError = signal('');
  operationError = signal('');
  
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
    private blogService: BlogService,
    private cloudinaryService: CloudinaryService,
    private authService: AdminAuthService,
    private router: Router
  ) {}

  async onImageSelected(event: Event, target: 'message' | 'blog' | 'discipler') {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.uploadMessage.set('Choose an image file to upload.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.uploadMessage.set('Images must be 10 MB or smaller.');
      return;
    }

    const folders = {
      message: 'messages',
      blog: 'blogs',
      discipler: 'discipler-avatars'
    } as const;

    this.uploadingImage.set(true);
    this.uploadMessage.set('Uploading image…');
    try {
      const imageUrl = await this.cloudinaryService.uploadImage(file, folders[target]);
      if (target === 'message') this.messageFormModel.imageUrl = imageUrl;
      if (target === 'blog') this.blogFormModel.imageUrl = imageUrl;
      if (target === 'discipler') this.disciplerFormModel.avatar = imageUrl;
      this.uploadMessage.set('Image uploaded successfully.');
    } catch (error) {
      console.error('Image upload failed', error);
      this.uploadMessage.set('Image upload failed. Please try again.');
    } finally {
      this.uploadingImage.set(false);
    }
  }

  async onAudioSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (!file.type.startsWith('audio/')) {
      this.uploadMessage.set('Choose an audio file to upload.');
      return;
    }
    this.uploadingImage.set(true);
    this.uploadMessage.set('Uploading audio…');
    try {
      const url = await this.cloudinaryService.uploadAudio(file, 'messages');
      this.messageFormModel.audioUrl = url;
      this.uploadMessage.set('Audio uploaded successfully.');
    } catch (error) {
      console.error('Audio upload failed', error);
      this.uploadMessage.set('Audio upload failed. Please try again.');
    } finally {
      this.uploadingImage.set(false);
    }
  }

  signOut() {
    this.logoutError.set('');
    this.authService.logout().subscribe({
      next: () => this.router.navigateByUrl('/admin/login'),
      error: error => {
        console.error('Admin sign out failed', error);
        this.logoutError.set('Unable to sign out. Please try again.');
      }
    });
  }
  
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
      date: form.date,
      imageUrl: form.imageUrl || undefined,
      audioUrl: form.audioUrl || undefined
    
    const request = this.editingMessage()
      ? this.messageService.updateMessage(this.editingMessage()!.id, messageData)
      : this.messageService.addMessage(messageData);
    this.saveChange(request, 'Message saved.', () => this.resetMessageForm());
  }
  
  editMessage(message: Message) {
    this.editingMessage.set(message);
    const discipler = this.disciplers().find(d => d.name === message.disciplerName);
    this.messageFormModel = {
      disciplerId: discipler?.id || 0,
      title: message.title,
      content: message.content,
      date: message.date,
      imageUrl: message.imageUrl || '',
      audioUrl: message.audioUrl || ''
    };
    this.showMessageForm.set(true);
  }
  
  deleteMessage(id: number) {
    if (confirm('Are you sure you want to delete this message?')) {
      this.saveChange(this.messageService.deleteMessage(id), 'Message deleted.');
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
      date: new Date(),
      imageUrl: '',
      audioUrl: ''
    };
  }
  onAddBlog() {
    const form = this.blogFormModel;
    const blogData: Omit<Blog, 'id'> = {
      title: form.title,
      content: form.content,
      author: form.author,
      date: form.date,
      imageUrl: form.imageUrl
    };
    
    const request = this.editingBlog()
      ? this.blogService.updateBlog(this.editingBlog()!.id, blogData)
      : this.blogService.addBlog(blogData);
    this.saveChange(request, 'Blog saved.', () => this.resetBlogForm());
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
      this.saveChange(this.blogService.deleteBlog(id), 'Blog deleted.');
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
      phone: form.phone,
      avatar: form.avatar || undefined
    };
    
    const request = this.editingDiscipler()
      ? this.disciplerService.updateDiscipler(this.editingDiscipler()!.id, disciplerData)
      : this.disciplerService.addDiscipler(disciplerData);
    this.saveChange(request, 'Discipler saved.', () => this.resetDisciplerForm());
  }
  
  editDiscipler(discipler: Discipler) {
    this.editingDiscipler.set(discipler);
    this.disciplerFormModel = {
      name: discipler.name,
      email: discipler.email,
      phone: discipler.phone,
      avatar: discipler.avatar || ''
    };
    this.showDisciplerForm.set(true);
  }
  
  deleteDiscipler(id: number) {
    if (confirm('Are you sure you want to delete this discipler?')) {
      this.saveChange(this.disciplerService.deleteDiscipler(id), 'Discipler deleted.');
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
      phone: '',
      avatar: ''
    };
  }

  private saveChange<T>(request: Observable<T>, successMessage: string, afterSuccess?: () => void) {
    this.operationError.set('');
    request.subscribe({
      next: () => {
        this.uploadMessage.set(successMessage);
        afterSuccess?.();
      },
      error: error => {
        console.error('Admin change failed', error);
        this.operationError.set('Could not save this change. Check the server and try again.');
      }
    });
  }
}