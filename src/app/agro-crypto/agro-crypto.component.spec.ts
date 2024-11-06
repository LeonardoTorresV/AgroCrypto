import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgroCryptoComponent } from './agro-crypto.component';

describe('AgroCryptoComponent', () => {
  let component: AgroCryptoComponent;
  let fixture: ComponentFixture<AgroCryptoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgroCryptoComponent]
    });
    fixture = TestBed.createComponent(AgroCryptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
