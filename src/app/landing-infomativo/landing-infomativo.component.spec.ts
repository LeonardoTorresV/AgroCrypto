import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingInfomativoComponent } from './landing-infomativo.component';

describe('LandingInfomativoComponent', () => {
  let component: LandingInfomativoComponent;
  let fixture: ComponentFixture<LandingInfomativoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingInfomativoComponent]
    });
    fixture = TestBed.createComponent(LandingInfomativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
