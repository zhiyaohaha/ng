import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BranchCountComponent } from "./branch-count.component";

describe("BranchCountComponent", () => {
  let component: BranchCountComponent;
  let fixture: ComponentFixture<BranchCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
