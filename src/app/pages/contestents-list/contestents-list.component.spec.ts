import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestentsListComponent } from './contestents-list.component';

describe('ContestentsListComponent', () => {
  let component: ContestentsListComponent;
  let fixture: ComponentFixture<ContestentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContestentsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
