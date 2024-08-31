import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableBikeRidesComponent } from './available-bike-rides.component';

describe('AvailableBikeRidesComponent', () => {
  let component: AvailableBikeRidesComponent;
  let fixture: ComponentFixture<AvailableBikeRidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvailableBikeRidesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableBikeRidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
