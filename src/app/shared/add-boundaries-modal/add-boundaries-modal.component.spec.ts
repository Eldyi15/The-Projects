import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBoundariesModalComponent } from './add-boundaries-modal.component';

describe('AddBoundariesModalComponent', () => {
  let component: AddBoundariesModalComponent;
  let fixture: ComponentFixture<AddBoundariesModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBoundariesModalComponent]
    });
    fixture = TestBed.createComponent(AddBoundariesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
