import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LoanCountComponent } from "./loan-count.component";

describe("LoanCountComponent", () => {
  let component: LoanCountComponent;
  let fixture: ComponentFixture<LoanCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
