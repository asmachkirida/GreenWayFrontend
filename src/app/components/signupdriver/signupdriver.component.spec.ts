import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupdriverComponent } from './signupdriver.component';

describe('SignupdriverComponent', () => {
  let component: SignupdriverComponent;
  let fixture: ComponentFixture<SignupdriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupdriverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupdriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
