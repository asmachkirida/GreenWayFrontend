import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeridesComponent } from './bikerides.component';

describe('BikeridesComponent', () => {
  let component: BikeridesComponent;
  let fixture: ComponentFixture<BikeridesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BikeridesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BikeridesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
