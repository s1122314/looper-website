import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundsListComponent } from './sounds-list.component';

describe('SoundsListComponent', () => {
  let component: SoundsListComponent;
  let fixture: ComponentFixture<SoundsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SoundsListComponent]
    });
    fixture = TestBed.createComponent(SoundsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
