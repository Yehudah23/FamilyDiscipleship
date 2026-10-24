import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Discplers } from './discplers';

describe('Discplers', () => {
  let component: Discplers;
  let fixture: ComponentFixture<Discplers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Discplers],
    }).compileComponents();

    fixture = TestBed.createComponent(Discplers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
