import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeRidesComponent } from './bike-rides.component';

describe('BikeRidesComponent', () => {
  let component: BikeRidesComponent;
  let fixture: ComponentFixture<BikeRidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BikeRidesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BikeRidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
