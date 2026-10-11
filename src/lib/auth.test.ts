import { describe, it, expect } from "vitest";
import { resolveRole } from "./auth";

describe("resolveRole", () => {
  it("admin only from app_metadata", () => {
    expect(resolveRole({ role: "admin" })).toBe("admin");
  });
  it("anything else is user", () => {
    expect(resolveRole({ role: "superadmin" })).toBe("user");
    expect(resolveRole(null)).toBe("user");
    expect(resolveRole(undefined)).toBe("user");
  });
});
