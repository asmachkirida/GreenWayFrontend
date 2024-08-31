import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikerideHistoryComponent } from './bikeride-history.component';

describe('BikerideHistoryComponent', () => {
  let component: BikerideHistoryComponent;
  let fixture: ComponentFixture<BikerideHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BikerideHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BikerideHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
