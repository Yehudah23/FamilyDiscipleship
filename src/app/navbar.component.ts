import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled">
      <div class="navbar-container">
        <div class="navbar-brand">
          <img src="/logo.png" alt="Discipleship Logo" class="navbar-logo" />
          <h1>The Meeting</h1>
        </div>
        
        <button class="menu-toggle" (click)="toggleMenu()" [class.active]="menuOpen" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <ul class="navbar-nav" [class.open]="menuOpen">
          <li><a routerLink="/" routerLinkActive="active" (click)="closeMenu()">Home</a></li>
          <li><a routerLink="/discplers" routerLinkActive="active" (click)="closeMenu()">Disciplers</a></li>
          <li><a routerLink="/messages" routerLinkActive="active" (click)="closeMenu()">Messages</a></li>
          <li><a routerLink="/about" routerLinkActive="active" (click)="closeMenu()">About</a></li>
          <li><a routerLink="/beliefs" routerLinkActive="active" (click)="closeMenu()">What We Believe</a></li>
          <li><a routerLink="/programs" routerLinkActive="active" (click)="closeMenu()">Programs</a></li>
          <li><a routerLink="/blogs" routerLinkActive="active" (click)="closeMenu()">Blogs</a></li>
          <li><a routerLink="/admin" routerLinkActive="active" (click)="closeMenu()">Admin</a></li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.75rem 2rem;
      background: rgba(4, 68, 129, 0.85);
      color: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
      position: sticky;
      top: 0;
      z-index: 1000;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      transition: all 0.3s ease;
    }

    .navbar.scrolled {
      background: rgba(4, 68, 129, 0.95);
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    }

    .navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1200px;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .navbar-logo {
      height: 44px;
      width: auto;
      border-radius: 6px;
      transition: transform 0.3s ease;
    }

    .navbar-brand:hover .navbar-logo {
      transform: scale(1.05);
    }

    .navbar-brand h1 {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .navbar-nav {
      display: flex;
      list-style: none;
      gap: 0.25rem;
      margin: 0;
      padding: 0;
    }

    .navbar-nav a {
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      padding: 0.6rem 1.1rem;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.95rem;
      transition: all 0.25s ease;
      position: relative;
    }

    .navbar-nav a:hover {
      background: rgba(255,255,255,0.1);
      color: white;
    }

    .navbar-nav a.active {
      background: rgba(255,255,255,0.12);
      color: white;
    }

    .navbar-nav a.active::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 3px;
      background: #3b82f6;
      border-radius: 2px;
    }

    .menu-toggle {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      transition: background 0.2s;
    }

    .menu-toggle span {
      width: 24px;
      height: 2.5px;
      background: white;
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .menu-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .menu-toggle.active span:nth-child(2) {
      opacity: 0;
    }

    .menu-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }

    @media (max-width: 768px) {
      .menu-toggle {
        display: flex;
      }

      .navbar-nav {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        background: rgba(4, 68, 129, 0.98);
        padding: 1rem;
        gap: 0.25rem;
        transform: translateY(-120%);
        transition: transform 0.3s ease;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      }

      .navbar-nav.open {
        transform: translateY(0);
      }

      .navbar-nav a {
        padding: 0.85rem 1rem;
        font-size: 1rem;
      }

      .navbar-brand h1 {
        font-size: 1.2rem;
      }

      .navbar-logo {
        height: 36px;
      }
    }
  `]
})
export class NavbarComponent {
  isScrolled = false;
  menuOpen = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}