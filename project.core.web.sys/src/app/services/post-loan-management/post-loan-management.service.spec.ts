import { TestBed, inject } from "@angular/core/testing";

import { PostLoanManagementService } from "./post-loan-management.service";

describe("PostLoanManagementService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostLoanManagementService]
    });
  });

  it("should be created", inject([PostLoanManagementService], (service: PostLoanManagementService) => {
    expect(service).toBeTruthy();
  }));
});
