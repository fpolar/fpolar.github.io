import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WcardComponent } from './wcard.component';

describe('WcardComponent', () => {
  let component: WcardComponent;
  let fixture: ComponentFixture<WcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WcardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
