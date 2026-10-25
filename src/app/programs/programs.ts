import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Program {
  id: number;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  type: 'weekly' | 'monthly' | 'special' | 'youth';
  image?: string;
  leader: string;
  capacity?: number;
  registered?: number;
}

type ProgramFilter = 'all' | 'weekly' | 'monthly' | 'special' | 'youth';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './programs.html',
  styleUrl: './programs.css'
})
export class Programs {
  filter = signal<ProgramFilter>('all');
  
  programs = signal<Program[]>([
    {
      id: 1,
      title: 'Family Bible Study',
      description: 'Weekly inductive Bible study for the whole family. We go through Scripture chapter by chapter with age-appropriate discussion questions for children and deeper theological exploration for adults.',
      date: new Date('2026-10-06'),
      time: '7:00 PM - 8:30 PM',
      location: 'Main Sanctuary',
      type: 'weekly',
      leader: 'Glory Adekunle Opekun',
      capacity: 50,
      registered: 32
    },
    {
      id: 2,
      title: 'Youth Connect Night',
      description: 'High-energy evening with worship, games, and relevant teaching for teens. This month we\'re exploring identity in Christ through the book of Ephesians.',
      date: new Date('2026-10-10'),
      time: '6:30 PM - 9:00 PM',
      location: 'Youth Center',
      type: 'youth',
      leader: 'Pastor Adeshina peter Olayinka',
      capacity: 80,
      registered: 56
    },
    {
      id: 3,
      title: 'Marriage Enrichment Workshop',
      description: 'A special 4-week series designed to strengthen marriages through biblical principles. Topics include communication, conflict resolution, intimacy, and shared spiritual disciplines.',
      date: new Date('2026-10-18'),
      time: '6:00 PM - 8:30 PM',
      location: 'Fellowship Hall',
      type: 'special',
      leader: 'Glory Adekunle Opekun',
      capacity: 30,
      registered: 18
    },
    {
      id: 4,
      title: 'Men\'s Prayer Breakfast',
      description: 'Monthly gathering for men to pray, study God\'s Word, and build accountability. This month focusing on leading families spiritually.',
      date: new Date('2026-11-02'),
      time: '7:00 AM - 9:00 AM',
      location: 'Community Room',
      type: 'monthly',
      leader: 'Pastor Kehinde Ogunwole',
      capacity: 40,
      registered: 24
    },
    {
      id: 5,
      title: 'Women\'s Bible Study: Psalms',
      description: 'In-depth study of selected Psalms, exploring how to pray the Psalms in every season of life. Childcare provided.',
      date: new Date('2026-10-14'),
      time: '9:30 AM - 11:30 AM',
      location: 'Women\'s Ministry Room',
      type: 'weekly',
      leader: 'Pastor Simon poopola',
      capacity: 35,
      registered: 28
    },
    {
      id: 6,
      title: 'Family Worship Night',
      description: 'Monthly extended worship and prayer gathering for all ages. Includes testimony sharing, corporate prayer, and communion.',
      date: new Date('2026-11-15'),
      time: '6:00 PM - 8:00 PM',
      location: 'Main Sanctuary',
      type: 'monthly',
      leader: 'Glory Adekunle Opekun',
      capacity: 100,
      registered: 45
    },
    {
      id: 7,
      title: 'Parenting with Purpose Conference',
      description: 'Annual one-day conference featuring guest speakers, breakout sessions, and practical workshops for parents at every stage.',
      date: new Date('2026-11-22'),
      time: '9:00 AM - 4:00 PM',
      location: 'Convention Center',
      type: 'special',
      leader: 'Glory Adekunle Opekun',
      capacity: 200,
      registered: 89
    },
    {
      id: 8,
      title: 'Teen Discipleship Retreat',
      description: 'Weekend retreat for teens focused on spiritual formation, community building, and discovering God\'s calling. Includes outdoor activities and small groups.',
      date: new Date('2026-12-05'),
      time: 'Friday 6PM - Sunday 2PM',
      location: 'Mountain View Camp',
      type: 'youth',
      leader: 'Pastor Adeshina peter Olayinka',
      capacity: 60,
      registered: 34
    }
  ]);
  
  filteredPrograms = computed(() => {
    const f = this.filter();
    if (f === 'all') return this.programs();
    return this.programs().filter(p => p.type === f);
  });
  
  upcomingPrograms = computed(() => {
    const now = new Date();
    return this.programs()
      .filter(p => p.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  });
  
  setFilter(f: ProgramFilter) {
    this.filter.set(f);
  }
  
  getTypeLabel(type: Program['type']): string {
    const labels = {
      weekly: 'Weekly',
      monthly: 'Monthly',
      special: 'Special Events',
      youth: 'Youth Programs'
    };
    return labels[type];
  }
  
  getProgress(program: Program): number {
    if (!program.capacity) return 0;
    return Math.round((program.registered || 0) / program.capacity * 100);
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }
}
