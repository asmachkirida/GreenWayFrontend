import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeRideDialogComponent } from './bike-ride-dialog.component';

describe('BikeRideDialogComponent', () => {
  let component: BikeRideDialogComponent;
  let fixture: ComponentFixture<BikeRideDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BikeRideDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BikeRideDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
