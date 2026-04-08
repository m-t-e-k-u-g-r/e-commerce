import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderOverviewComponent } from './order-overview.component';

describe('OrderOverviewComponent', () => {
  let component: OrderOverviewComponent;
  let fixture: ComponentFixture<OrderOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderOverviewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
