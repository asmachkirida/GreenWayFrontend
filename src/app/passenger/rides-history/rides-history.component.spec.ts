import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RidesHistoryComponent } from './rides-history.component';

describe('RidesHistoryComponent', () => {
  let component: RidesHistoryComponent;
  let fixture: ComponentFixture<RidesHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RidesHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RidesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
