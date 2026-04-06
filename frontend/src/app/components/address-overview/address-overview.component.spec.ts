import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressOverviewComponent } from './address-overview.component';

describe('AddressOverviewComponent', () => {
  let component: AddressOverviewComponent;
  let fixture: ComponentFixture<AddressOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressOverviewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
